import { _decorator, Camera, Component, Node, Vec3 } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('CamFollow')
export class CamFollow extends Component {

    @property(Node)
    target: Node | null = null;

    @property
    distance: number = 5;

    @property
    height: number = 2;

    @property
    smoothness: number = 0.1;

    @property
    offsetX: number = 0;




    private _camera: Camera | null = null;
    start() {
        this._camera = this.getComponent(Camera);
        if (!this._camera) {
            console.error("Camera component not found on this node.");
        }
        // this.followTarget();
    }

    followTarget() {
        if (!this.target || !this._camera) return;

        const targetPosition = this.target.worldPosition;
        const targetRotation = this.target.worldRotation;

        // Tạo một vector hướng ngược lại với Vec3.FORWARD
        const backwardDirection = new Vec3(0, 0, -1);
        Vec3.transformQuat(backwardDirection, backwardDirection, targetRotation);

        const desiredPosition = new Vec3();
        Vec3.scaleAndAdd(desiredPosition, targetPosition, backwardDirection, this.distance);
        desiredPosition.y += this.height;
        desiredPosition.x += this.offsetX;
        // DataManager.instance.offsetX;



        const smoothedPosition = new Vec3();
        Vec3.lerp(smoothedPosition, this.node.worldPosition, desiredPosition, this.smoothness);

        this.node.setWorldPosition(smoothedPosition);

        this.node.lookAt(targetPosition);
        

        // up 10*
        // this.node.setRotationFromEuler(0,0,10)
    }



    update(deltaTime: number) {
        this.followTarget();
    }
}

