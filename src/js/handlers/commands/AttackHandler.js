class AttackHandler {
  static get ID() {
    return 30692;
  }

  constructor() {
    this._handler = function (e, a) {
      var shipAttackCmd = JSON.parse(e.detail);
      if (window.settings.sentinelMode) {
    	let attackerID = shipAttackCmd[Variables.attackerId];
        let shipAttackedID = shipAttackCmd[Variables.attackedId];
        
        if (attackerID == window.globalSettings.sentinelid) {
          a.sentinelship.targetId = shipAttackedID;
        }
        
        if (shipAttackedID == window.globalSettings.sentinelid) {
          a.sentinelship.attackerID = attackerID;
        }
      }   
    }
  }

  get handler() {
    return this._handler;
  }
}