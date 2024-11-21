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
    @property({ type: Node })
    public test1: Node | null = null;
    @property({ type: Node })
    public test2: Node | null = null;

    private timeFrame: number = 0.005
    // 0.005;


    start() {
        let t = this;
        t.schedule(() => {
            t.seek()
            t.checkIsNextPoint();
            // t.goHeadByPositionZ()
        }, t.timeFrame);
        t.calculationAngle();

        // t.test()

        // t.schedule(() => {
        //     let temp = v3(t.node.position.x, t.node.position.y, t.node.position.z + 0.5)
        //     t.node.position = temp;
        // }, t.timeFrame);

    }


    test() {
        let t = this;
        // let velocity = new Vec3();
        // t.test1.getWorldPosition(velocity);
        // let temp = Vec3.angle(velocity, t.node.forward) * (180 / Math.PI) - 90;
        // console.log('goc cua moto', temp);


        let temp = Vec3.angle(t.test1.position, t.test2.position) * (180 / Math.PI)
        console.log('goc cua moto', temp);
    }



    checkIsNextPoint() {
        let t = this;
        if (t.numberP != DataManager.instance.point) {
            t.numberP = DataManager.instance.point;
            t.calculationAngle();
            // t.node.setRotation(t.map.getChildByName((DataManager.instance.point - 1).toString()).rotation);
            // DataManager.instance.offsetX = 1 / t.angleOf2Point;
            // console.log(t.body.eulerAngles.y, t.numberP);
        }
    }


    seek() {
        let t = this;
        if (!DataManager.instance.isRun) {
            return
        }
        let n = t.node.getWorldPosition(new Vec3());
        let maxSpeed = DataManager.instance.speed;
        let target = t.map.getChildByName(DataManager.instance.point.toString())
        let positionTarget = target.getWorldPosition(new Vec3());
        let desired = new Vec3();
        const deltaX = positionTarget.x - n.x;
        const deltaY = positionTarget.y - n.y;
        const deltaZ = positionTarget.z - n.z;
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
        // desired là vec3 của world
        // t.node.position = desired;



        // tạo velocity tăng độ smooth
        let velocity = new Vec3();
        t.test1.getWorldPosition(velocity);
        let steering = new Vec3();
        Vec3.lerp(steering, desired, velocity, 0.1);



        // lấy góc hướng
        // let wpn = t.test1.position.clone();
        // t.node.getWorldPosition();
        // t.test2.setWorldPosition(steering);
        // let wpt = t.node.inverseTransformPoint(new Vec3(), positionTarget)
        // positionTarget
        // t.test2.getWorldPosition();
        // let director = wpn.subtract(wpt).normalize();
        // let angleTemp = Vec3.angle(director, v3(0, 1, 0)) * (180 / Math.PI);
        // console.log(angleTemp);
        // t.test2.position = wpt
        let rs = t.getAngleBetweenVector(t.test1.position.clone(), t.node.inverseTransformPoint(new Vec3(), steering))
        console.log(rs);




        t.node.position = steering;





        // test
        // let temp = Vec3.angle(steering, target.getWorldPosition(new Vec3)) * (180 / Math.PI)
        // console.log('goc cua moto', temp);
        // let QuatAngle = Quat.fromAxisAngle(new Quat(), new Vec3(0, 1, 0), temp);
        // t.node.setWorldRotation(QuatAngle);


        // fail
        // console.log('test goc', t.getAngleBetweenVector(velocity, target.position));
        // console.log(t.test1.getWorldRotation(), t.node.getWorldRotation());
        // t.node.setWorldRotation(t.test1.getWorldRotation())
        // let angle = DataManager.instance.isTurnRight ? (t.node.eulerAngles.y - t.timeFrame / 100) : (t.node.eulerAngles.y + t.timeFrame / 100);
        // DataManager.instance.redirect ?
        //     t.node.setWorldRotation(Quat.fromAxisAngle(new Quat(), new Vec3(0, 1, 0), angle)) : 0;

        DataManager.instance.angle += (t.degree * distance / t.disNext);

        //fail
        // console.log(t.degree, distance / t.disNext, DataManager.instance.angle);
        // let axis = new Vec3(0, 1, 0);
        // let quatTranfer = new Quat();
        // let QuatAngle = Quat.fromAxisAngle(quatTranfer, axis, (DataManager.instance.angle - 149));
        // t.body.setWorldRotation(QuatAngle);

        t.body.setRotationFromEuler(v3(0, t.body.eulerAngles.y +0.005, 0))



    }

    getAngleBetweenVector(A: Vec3, B: Vec3) {
        // tích vô hướng của 2 vector
        let dotP = Vec3.dot(A, B);
        // dộ lớn của 2 vector
        let lengthA = A.length();
        let lengthB = B.length();
        // tính cosin của góc
        let cosTheta = dotP / (lengthA * lengthB)
        // tính góc radian rồi chuyển sang độ
        let radianOf2V = Math.acos(cosTheta) * (180 / Math.PI);
        // console.log("độ :" + radianOf2V);
        let rs = new Vec3();

        return radianOf2V
        // let axis = new Vec3(0, 1, 0);
        // let quater = new Quat();
        // return Quat.fromAxisAngle(quater, axis, ((radia) + radianOf2V));

    }



    disNext: number = 0;
    calculationAngle() {
        let t = this;
        let backPoint;
        if (DataManager.instance.point == 0) {
            backPoint = t.map.getChildByName("s");
        } else
            backPoint = t.map.getChildByName((DataManager.instance.point - 1).toString());
        let frontPoint = t.map.getChildByName((DataManager.instance.point).toString());
        t.disNext = Vec3.distance(backPoint.position, frontPoint.position);
        t.angleOf2Point = frontPoint.eulerAngles.y - backPoint.eulerAngles.y;
        // frontPoint.rotation.y - backPoint.rotation.y;
        t.degree = t.angleOf2Point / t.disNext;
        // t.body.setWorldRotation(Quat.fromEuler(new Quat(), 0, DataManager.instance.angle, 0));
        // console.log('do lech', frontPoint.eulerAngles.y - 149);

    }


    goHeadByPositionZ() {
        // only 2d work normal, not 3d
        let t = this;
        if (!DataManager.instance.isRun) {
            return
        }
        let positionNew = new Vec3(t.node.position.x, t.node.position.y, t.node.position.z + DataManager.instance.speed);
        t.node.position = positionNew;
    }




    update(deltaTime: number) {
        // if (t.redirect) {
        //     // let direct = new Quat;
        //     let rotationCar = new Quat;
        //     let d = t.speed > 60 ? 1 : 2;
        //     // Quat.fromAxisAngle(direct, Vec3.FORWARD, t.isRight ? ((-deltaTime * 100) * Math.PI / 180) : ((deltaTime * 100) * Math.PI / 180));
        //     // t.temp.rotate(direct);
        //     Quat.fromAxisAngle(rotationCar, Vec3.UP, t.isRight ? ((-deltaTime * 100) * Math.PI / 180) / d : ((deltaTime * 100) * Math.PI / 180) / d);
        //     t.node.rotate(rotationCar);
        //     // const movement = t.temp.position.clone();
        //     // let temp = movement.x > 3 || movement.x < -3 ? -0.01 : 0.01
        //     // Vec3.multiplyScalar(movement, new Vec3(1, 0, 0), t.isRight ? temp * -1 : temp);
        //     // t.controllDirect.translate(movement);
        // }
    }
}

