import { _decorator, Component, Node, Vec3, math, v3, quat, Quat } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('Vehicles')
export class Vehicles extends Component {

    // private position: Vec3 = null;
    // private velocity: Vec3 = null;
    // private acceleration: Vec3 = null;
    // private maxSpped = 1;
    // private maxForce = 1;
    private degree: number = 0;
    private count: number = 0;
    private numberP: number = 0;
    @property({ type: Node })
    public map: Node | null = null;
    private angleOf2Point: number = 0;

    @property({ type: Node })
    public body: Node | null = null;

    private timeFrame: number = 0.005
    // 0.005;

    @property({ type: Node })
    public test: Node | null = null;

    start() {
        let t = this;
        t.schedule(() => {
            t.seek()
            t.checkIsNextPoint();
        }, t.timeFrame);
        t.calculationAngle();

    }

    checkIsNextPoint() {
        let t = this;
        if (t.numberP != DataManager.instance.point) {
            t.numberP = DataManager.instance.point;
            t.calculationAngle();
            t.node.setRotation(t.map.getChildByName((DataManager.instance.point - 1).toString()).rotation);
            // DataManager.instance.offsetX = 1 / t.angleOf2Point;

        }
    }


    seek() {
        let t = this;
        if (!DataManager.instance.isRun) {
            return
        }
        let maxSpeed = DataManager.instance.speed;
        let target = t.map.getChildByName(DataManager.instance.point.toString())
        let positionTarget = target.position;
        let desired = new Vec3();
        const deltaX = positionTarget.x - t.node.position.x;
        const deltaY = positionTarget.y - t.node.position.y;
        const deltaZ = positionTarget.z - t.node.position.z;
        const distanceSqr = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
        if (distanceSqr === 0 || (maxSpeed >= 0 && distanceSqr < maxSpeed * maxSpeed)) {
            desired.x = positionTarget.x;
            desired.y = positionTarget.y;
            desired.z = positionTarget.z;
            t.node.position = desired;
            // t.node.setRotation(target.rotation);
            return
        }
        const distance = Math.sqrt(distanceSqr);
        const scale = maxSpeed / distance;
        desired.x = t.node.position.x + deltaX * scale;
        desired.y = t.node.position.y + deltaY * scale;
        desired.z = t.node.position.z + deltaZ * scale;

        // t.test.lookAt(desired);
        // console.log(t.test.eulerAngles.y);

        t.node.position = desired;
        

    }

    calculationAngle() {
        let t = this;
        let backPoint;
        if (DataManager.instance.point == 0) {
            backPoint = t.map.getChildByName("s");
        } else
            backPoint = t.map.getChildByName((DataManager.instance.point - 1).toString());
        let frontPoint = t.map.getChildByName((DataManager.instance.point).toString());
        let dis = Vec3.distance(backPoint.position, frontPoint.position);
        t.angleOf2Point = frontPoint.eulerAngles.y - backPoint.eulerAngles.y;
        // frontPoint.rotation.y - backPoint.rotation.y;
        t.degree = t.angleOf2Point / dis;
        DataManager.instance.angle = frontPoint.eulerAngles.y;
        // t.body.setWorldRotation(Quat.fromEuler(new Quat(), 0, DataManager.instance.angle, 0));

    }


    update(deltaTime: number) {

    }
}

