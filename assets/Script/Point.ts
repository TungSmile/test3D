import { _decorator, BoxCollider, Component, ICollisionEvent, Node } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('Point')
export class Point extends Component {
    nextNumber: number = 0;
    isDone: boolean = false;

    start() {
        let t = this;
        t.nextNumber = Number(t.node.name) + 1;
        let collider = this.node.getComponent(BoxCollider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        collider.on('onTriggerStay', this.onTriggerEnter, this);
        collider.on('onTriggerExit', this.onTriggerEnter, this);

    }

    private onTriggerEnter(event: ICollisionEvent) {
        let t = this;
        if (!t.isDone) {
            DataManager.instance.point = t.nextNumber;
            t.isDone = true;

        }
    }

    update(deltaTime: number) {

    }
}

