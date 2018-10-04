class GeneralSettingsWindow {
  createWindow() {
    this.botSettingsWindow = WindowFactory.createWindow({
      width: 320,
      text: chrome.i18n.getMessage("general")
    });

    let controls = [
      {
        name: 'palladium',
        labelText: chrome.i18n.getMessage("palladiumbot"),
        appendTo: this.botSettingsWindow,
        event: function () {
          window.settings.palladium = this.checked;
        }
      },
      {
        name: 'piratebot',
        labelText: chrome.i18n.getMessage("piratebot"),
        appendTo: this.botSettingsWindow,
        event: function () {
          window.settings.piratebot = this.checked;
        }
      },
      {
        name: 'piratebotsag',
        labelText: chrome.i18n.getMessage("piratebotsag"),
        appendTo: this.botSettingsWindow,
        event: function () {
          window.settings.piratebotsag = this.checked;
        }
      },
      {
        name: 'cubibot',
        labelText: chrome.i18n.getMessage("cubibot"),
        appendTo: this.botSettingsWindow,
        event: function () {
          window.settings.cubibot = this.checked;
        }
      },
	  {
	    name: 'ggbot',
	    labelText: chrome.i18n.getMessage("ggbot"),
        appendTo: this.botSettingsWindow,
	    event: function () {
	      window.settings.ggbot = this.checked;
	    }
  	  },
      {
        name: 'gatestonpc',
        labelText: chrome.i18n.getMessage("gatestonpc"),
        appendTo: this.botSettingsWindow,
        event: function () {
         window.settings.gatestonpc = this.checked;
        }
      },
      {
        name: 'npcCircle',
        labelText: chrome.i18n.getMessage("circle"),
        appendTo: this.botSettingsWindow,
        event: function () {
          window.settings.circleNpc = this.checked;
        }
      },
      {
        name: 'npcCircleRadius',
        labelText: chrome.i18n.getMessage("circleradius"),
        type: 'range',
        appendTo: this.botSettingsWindow,
        labelBefore: true,
        attrs: {
          min: 1,
          max: 800,
          step: 1,
          value: 500,
        },
        event: function (ev) {
          window.settings.npcCircleRadius = this.value;
          $('span:last-child', this.label).text(' (' + this.value + 'px)');
        }
      },
      {
        name: 'dontCircleWhenHpBelow25Percent',
        labelText: chrome.i18n.getMessage("dontcirclewhenhp"),
        appendTo: this.botSettingsWindow,
        event: function () {
          window.settings.dontCircleWhenHpBelow25Percent = this.checked;
        }
      },
      {
        name: 'repairWhenHpIsLowerThanPercent',
        labelText: chrome.i18n.getMessage("repairwhenhp"),
        type: 'range',
        appendTo: this.botSettingsWindow,
        labelBefore: true,
        attrs: {
          min: 0,
          max: 100,
          step: 1,
          value: 10,
        },
        event: function (ev) {
          window.settings.repairWhenHpIsLowerThanPercent = this.value;
          $('span:last-child', this.label).text(' (' + this.value + '%)');
        }
      }
    ];

    controls.forEach((control) => {
      this[control.name] = ControlFactory.createControl(control);
    });

    if (window.globalSettings.enableRefresh) {
      let saveButton = jQuery('<div class="saveButton"><button class="btn_save save btn">'+chrome.i18n.getMessage("savesettingsandenable")+'</button></div>');
    this.botSettingsWindow.append(saveButton);
    }
    let reloadSettings = jQuery('<div class="reloadSettings"><button class="btn_reload reload btn">'+chrome.i18n.getMessage("loadSettings")+'</button></div>');
    this.botSettingsWindow.append(reloadSettings);
  }
}