class GroupShipUpdatePosHandler {
    static get ID() {
      return 26710; 
    }
    
    constructor(f) {
      this._handler = function (e, a) {
        let parsedCmd = JSON.parse(e.detail);

         let id = parsedCmd[Variables.groupShipID];
         if (id != null &&  a.ships.hasOwnProperty(id)){
           let ship = a.ships[id];
           if(parsedCmd.updates[0].mapId == window.hero.mapId) {
        	 ship.setPosition(parsedCmd.updates[0].x,parsedCmd.updates[0].y);
        	 ship.setTarget(parsedCmd.updates[0].x,parsedCmd.updates[0].y,500);
        	 ship.inGroup = true;
           } else {
        	 if (ship != null) {
        	   delete a.ships[id];
        	 }
           }
         }
      }
    }
  
    get handler() {
      return this._handler;
    }
  }