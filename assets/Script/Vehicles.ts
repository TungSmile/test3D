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


    start() {
        let t = this;
        t.schedule(() => {
            t.seek()
            t.checkIsNextPoint();
        }, 0.007);
        t.calculationAngle();

    }

    checkIsNextPoint() {
        let t = this;
        if (t.numberP != DataManager.instance.point) {
            t.numberP = DataManager.instance.point;
            t.calculationAngle();
            // t.node.setRotation(t.map.getChildByName((DataManager.instance.point - 1).toString()).rotation);
            // DataManager.instance.offsetX = 1 / t.angleOf2Point;
            console.log('a');

        }
    }


    seek() {
        let t = this;
        if (!DataManager.instance.isRun) {
            return
        }
        let maxStep = DataManager.instance.speed;
        // let desired = new Vec3();
        // Vec3.subtract(desired, taget, t.node .position);
        // if (Vec3.len(desired) < t.maxSpped) {s
        //     // check max speed
        // }
        // let steer = new Vec3();
        // Vec3.subtract(steer, desired, t.velocity)
        // if (Vec3.len(steer) < t.maxForce) {
        //     // check max force
        // }
        // t.acceleration = steer;
        let target = t.map.getChildByName(DataManager.instance.point.toString())
        let positionTarget = target.position;
        let desired = new Vec3();
        const deltaX = positionTarget.x - t.node.position.x;
        const deltaY = positionTarget.y - t.node.position.y;
        const deltaZ = positionTarget.z - t.node.position.z;
        const distanceSqr = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
        if (distanceSqr === 0 || (maxStep >= 0 && distanceSqr < maxStep * maxStep)) {
            desired.x = positionTarget.x;
            desired.y = positionTarget.y;
            desired.z = positionTarget.z;
            t.node.position = desired;
            t.node.setRotation(target.rotation);
            // t.count += Vec3.distance(desired, t.node.position);
            return
        }
        const distance = Math.sqrt(distanceSqr);
        const scale = maxStep / distance;
        desired.x = t.node.position.x + deltaX * scale;
        desired.y = t.node.position.y + deltaY * scale;
        desired.z = t.node.position.z + deltaZ * scale;
        // let angle = t.degree * (distance / t.distance);
        // let temp = Number((Vec3.angle(t.node.position, desired) * (180 / Math.PI)).toFixed(1));
        // console.log('angle between of target and desired', temp);
        // t.count += Vec3.distance(desired, t.node.position);
        // console.log('s', scale);

        let angle = t.degree * Vec3.distance(desired, t.node.position)
        t.node.setRotationFromEuler(v3(0, t.node.eulerAngles.y + angle, 0))
        // console.log("how many angle", t.count);
        t.node.position = desired;
        // if (Number(angle.toFixed(4)) == 0) {
        //     t.count = 0;
        // } else
        // if (t.distance != 0)
        //     t.node.setRotationFromEuler(v3(0, t.node.eulerAngles.y + angle, 0))
        // console.log(t.node.eulerAngles.y, angle, t.node.eulerAngles.y + angle);
        // t.count += Number(angle.toFixed(4))
        // console.log(t.count);

        // DataManager.instance.offsetX != 0 ? DataManager.instance.offsetX -= 0.005 : 0;



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
        // t.distance = dis;
        console.log("angle", t.angleOf2Point, "angle/distance", t.degree, "total distance", dis, "count", t.count);


    }


    update(deltaTime: number) {

    }
}

