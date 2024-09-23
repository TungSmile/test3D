import { _decorator, BoxCollider, Component, ITriggerEvent, Node } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('Point')
export class Point extends Component {


    start() {
        // let collider = this.node.getComponent(BoxCollider);
        // collider.on('onTriggerStay', this.onTriggerStay, this);
    }

    private onTriggerStay(event: ITriggerEvent) {
        // let t = this;
        // DataManager.instance.currentPoin = Number(t.node.name)
    }

    update(deltaTime: number) {

    }
}

