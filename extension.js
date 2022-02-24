/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const GETTEXT_DOMAIN = 'my-indicator-extension';

const { Clutter, GObject, St } = imports.gi;

const Gettext = imports.gettext.domain(GETTEXT_DOMAIN);
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init(extension) {
        super._init(0.0, _('Pintar de verde'));
        this.extension = extension;

        this.add_child(new St.Icon({
            icon_name: 'face-smile-symbolic',
            style_class: 'system-status-icon',
        }));

        let item = new PopupMenu.PopupMenuItem(_('Pintar de verde'));
        item.connect('activate', () => {
            this.extension.colorize();
        });
        this.menu.addMenuItem(item);
    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;
        this._verde = false;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        this._indicator = new Indicator(this);
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
    
    colorize() {
        const [_, c] = Clutter.Color.from_string('#00ff00');
        const actors = global.get_window_actors();
        
        this.verde = !this.verde;
        
        actors.forEach(a => {
            if (this.verde) {
                const fx = new Clutter.ColorizeEffect();
                fx.set_tint(c);
                a.add_effect_with_name('verde', fx);
            } else {
                a.remove_effect_by_name('verde');
            }
        });
    }

}

function init(meta) {
    return new Extension(meta.uuid);
}
