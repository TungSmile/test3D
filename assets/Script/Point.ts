import { _decorator, BoxCollider, Component, ITriggerEvent, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Point')
export class Point extends Component {
    start() {
        // let collider = this.node.getComponent(BoxCollider);
        // collider.on('onTriggerStay', this.onTriggerStay, this);
    }

    private onTriggerStay(event: ITriggerEvent) {
        let t = this;
        console.log(t.node.name);
    }

    update(deltaTime: number) {

    }
}

