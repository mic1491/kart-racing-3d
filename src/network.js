// 4-Player Star-Topology PeerJS WebRTC Room Manager (Host + up to 3 Guests = 4 Human Players!)
export class RoomNetwork {
  constructor(callbacks) {
    this.cb = callbacks; // { onStatus, onRoster, onStartRace, onRemoteState }
    this.peer = null;
    this.role = null; // 'host' | 'guest'
    this.roomCode = '';
    this.mySlot = 0;
    this.hostConn = null; // guest -> host
    this.guestConns = new Map(); // host: slotIndex (1..3) -> conn
    this.roster = []; // [{ slot, name, kartId, driverId }]
    this.connected = false;
    this.lastSendTime = 0;
  }

  _ensurePeerLib() {
    return typeof window.Peer !== 'undefined';
  }

  disconnect() {
    if (this.hostConn) {
      try { this.hostConn.close(); } catch (_) {}
      this.hostConn = null;
    }
    for (const conn of this.guestConns.values()) {
      try { conn.close(); } catch (_) {}
    }
    this.guestConns.clear();
    if (this.peer) {
      try { this.peer.destroy(); } catch (_) {}
      this.peer = null;
    }
    this.role = null;
    this.roomCode = '';
    this.mySlot = 0;
    this.roster = [];
    this.connected = false;
  }

  createRoom(localInfo) {
    this.disconnect();
    if (!this._ensurePeerLib()) {
      this.cb.onStatus('連線元件載入中，請稍候再試', 'error');
      return;
    }
    this.role = 'host';
    this.mySlot = 0;
    this.roomCode = String(1000 + Math.floor(Math.random() * 9000));
    this.roster = [{ slot: 0, ...localInfo }];
    this.cb.onStatus(`建立 4 人房間 ${this.roomCode} 中...`, 'info');

    this.peer = new window.Peer(`kartlego3d-${this.roomCode}`);
    this.peer.on('open', () => {
      this.connected = true;
      this._emitHostRoster();
    });

    this.peer.on('connection', (conn) => {
      // Find first free slot in [1, 2, 3]
      let freeSlot = -1;
      for (const s of [1, 2, 3]) {
        if (!this.guestConns.has(s)) {
          freeSlot = s;
          break;
        }
      }
      if (freeSlot === -1) {
        conn.on('open', () => {
          conn.send({ type: 'full' });
          setTimeout(() => conn.close(), 200);
        });
        return;
      }

      this.guestConns.set(freeSlot, conn);
      conn.on('open', () => {
        conn.send({ type: 'assign', slot: freeSlot, roomCode: this.roomCode });
      });

      conn.on('data', (msg) => {
        if (!msg || typeof msg !== 'object') return;
        if (msg.type === 'hello') {
          this.roster = this.roster.filter((r) => r.slot !== freeSlot);
          this.roster.push({ slot: freeSlot, ...msg.info });
          this.roster.sort((a, b) => a.slot - b.slot);
          this._emitHostRoster();
        } else if (msg.type === 'state') {
          this.cb.onRemoteState(freeSlot, msg);
          // Relay to other guests
          for (const [otherSlot, otherConn] of this.guestConns.entries()) {
            if (otherSlot !== freeSlot && otherConn.open) {
              otherConn.send({ ...msg, slot: freeSlot });
            }
          }
        }
      });

      conn.on('close', () => {
        this.guestConns.delete(freeSlot);
        this.roster = this.roster.filter((r) => r.slot !== freeSlot);
        this._emitHostRoster();
      });
    });

    this.peer.on('error', (err) => {
      this.cb.onStatus(`連線錯誤：${err.type || err.message}`, 'error');
    });
  }

  _emitHostRoster() {
    const names = this.roster.map((r) => r.name).join('、');
    this.cb.onStatus(`房號 ${this.roomCode}｜已加入 ${this.roster.length}/4 人：${names}`, 'connected');
    this.cb.onRoster(this.roster);
    for (const conn of this.guestConns.values()) {
      if (conn.open) conn.send({ type: 'roster', roster: this.roster });
    }
  }

  joinRoom(code, localInfo) {
    this.disconnect();
    if (!this._ensurePeerLib()) {
      this.cb.onStatus('連線元件載入中，請稍候再試', 'error');
      return;
    }
    const clean = String(code || '').trim();
    if (!clean) {
      this.cb.onStatus('請輸入 4 位數房號', 'error');
      return;
    }
    this.role = 'guest';
    this.roomCode = clean;
    this.cb.onStatus(`正在連線到房間 ${clean}...`, 'info');

    this.peer = new window.Peer();
    this.peer.on('open', () => {
      const conn = this.peer.connect(`kartlego3d-${clean}`, { reliable: false });
      this.hostConn = conn;

      conn.on('open', () => {
        this.connected = true;
        conn.send({ type: 'hello', info: localInfo });
      });

      conn.on('data', (msg) => {
        if (!msg || typeof msg !== 'object') return;
        if (msg.type === 'full') {
          this.cb.onStatus(`房間 ${clean} 已滿（4/4 人）`, 'error');
          this.disconnect();
        } else if (msg.type === 'assign') {
          this.mySlot = msg.slot;
          conn.send({ type: 'hello', info: localInfo });
        } else if (msg.type === 'roster') {
          this.roster = msg.roster || [];
          const names = this.roster.map((r) => r.name).join('、');
          this.cb.onStatus(`已加入房間 ${this.roomCode}（${this.roster.length}/4 人：${names}）等待房主開始`, 'connected');
          this.cb.onRoster(this.roster);
        } else if (msg.type === 'start') {
          if (msg.roster) this.roster = msg.roster;
          this.cb.onStartRace(msg);
        } else if (msg.type === 'state') {
          if (typeof msg.slot === 'number' && msg.slot !== this.mySlot) {
            this.cb.onRemoteState(msg.slot, msg);
          }
        }
      });

      conn.on('close', () => {
        this.connected = false;
        this.cb.onStatus('已與房主斷線', 'error');
      });
    });

    this.peer.on('error', (err) => {
      this.cb.onStatus(`無法加入房間 ${clean}（${err.type || '請確認房號'}）`, 'error');
    });
  }

  sendHello(localInfo) {
    if (!this.connected) return;
    if (this.role === 'host') {
      this.roster = this.roster.filter((r) => r.slot !== 0);
      this.roster.unshift({ slot: 0, ...localInfo });
      this._emitHostRoster();
    } else if (this.hostConn && this.hostConn.open) {
      this.hostConn.send({ type: 'hello', info: localInfo });
    }
  }

  sendStart(payload) {
    if (this.role !== 'host') return;
    const msg = { type: 'start', roster: this.roster, ...payload };
    for (const conn of this.guestConns.values()) {
      if (conn.open) conn.send(msg);
    }
  }

  sendState(stateObj, nowMs) {
    if (!this.connected) return;
    if (nowMs - this.lastSendTime < 33) return;
    this.lastSendTime = nowMs;
    const msg = { type: 'state', slot: this.mySlot, ...stateObj };
    if (this.role === 'host') {
      for (const conn of this.guestConns.values()) {
        if (conn.open) conn.send(msg);
      }
    } else if (this.hostConn && this.hostConn.open) {
      this.hostConn.send(msg);
    }
  }
}
