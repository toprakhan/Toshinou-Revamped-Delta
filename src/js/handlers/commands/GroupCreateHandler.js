class GroupCreateHandler {
    static get ID() {
      return 15704; 
    }
    
    constructor(f) {
      this._handler = function (e, a) {
        let shipCreateCmd = JSON.parse(e.detail);

        if (shipCreateCmd.location.mapId == window.hero.mapId && shipCreateCmd.id != window.hero.id) {
          a.ships[shipCreateCmd.id] =  new Ship(shipCreateCmd.location.x, shipCreateCmd.location.y, shipCreateCmd.id, false, shipCreateCmd.name, shipCreateCmd.faction.faction, null, 2, shipCreateCmd.cloaked);
          let ship = a.ships[shipCreateCmd.id];
          ship.inGroup = true;
          ship.mapId = shipCreateCmd.location.mapId;
        }

      }
    }
  
    get handler() {
      return this._handler;
    }
  }