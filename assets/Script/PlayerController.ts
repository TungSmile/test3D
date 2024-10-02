import { _decorator, Component, EventMouse, Input, input, Node, Vec3, Quat, EventKeyboard, KeyCode, ICollisionEvent, ITriggerEvent, tween, easing, v3, Label, BoxCollider, Tween, TweenAction, Font, Collider, log, RigidBody } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property({ type: Node })
    public clockwise: Node | null = null;
    @property({ type: Label })
    public numberSpeed: Label | null = null;
    @property({ type: Node })
    public accelerator: Node | null = null;
    @property({ type: Node })
    public temp: Node | null = null;
    @property({ type: Node })
    public coll: Node | null = null;


    private redirect: boolean = false;
    private isRight: boolean = false;
    private ani: any;
    private km: number = 0;
    private driff: boolean;
    private smoothDriff: number = 5;
    private animation;
    private angles: number = 0;
    private countAngles: number = 0;
    private newAngles: boolean = false;
    @property({ type: Node })
    public tempMap: Node | null = null;
    public front: Node | null = null;
    public back: Node | null = null;

    start() {
        let t = this;
        t.animation = tween(t.node);
        // t.createTween()
        if (t.coll) {
            t.coll.getComponent(RigidBody).useCCD = true;
            t.coll.getComponent(BoxCollider).on('onTriggerEnter', this.onColliderEnter, t)
        }
        t.accelerator.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        t.accelerator.on(Input.EventType.TOUCH_END, this.onTouchEnd, this); ``
        t.accelerator.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        t.accelerator.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // input.on(Input.EventType.KEY_DOWN, this.downKey, this);
        // input.on(Input.EventType.KEY_UP, this.upKey, this);
        t.front = t.tempMap.children[t.km + 1];
        t.back = t.tempMap.children[t.km];

        t.schedule(() => {
            t.Drive()
        }, 0.001)


    }

    private onCollision(event: ICollisionEvent) {
        console.log(event.type, event);
    }
    private onTriggerStay(event: ITriggerEvent) {
        let t = this;




    }
    private angleY = 0;
    private totalDis: number;
    private brake: boolean = false;
    private onColliderEnter(event: ITriggerEvent) {
        let t = this;
        t.km++;
        if ((t.km + 1) >= t.tempMap.children.length) {
            t.brake = true;
            return;
        }
        t.front = t.tempMap.children[t.km + 1];
        t.back = t.tempMap.children[t.km];
        // Chuyển đổi độ sang radian
        // const angle = t.back.eulerAngles.y * Math.PI / 180;
        // t.node.rotation = Quat.fromAxisAngle(new Quat(), Vec3.UNIT_Y, angle);
        // t.node.rotation = t.back.rotation;
        // t.node.position = t.back.position;
        t.angleY = t.front.eulerAngles.y - t.back.eulerAngles.y;
        t.totalDis = Vec3.distance(t.front.position, t.back.position);
        console.log("angle :" + t.angleY);

    }
    Drive() {
        let t = this;
        // let frontv3 = front.rotation.getEulerAngles(new Vec3);
        // let angle = front.eulerAngles.y - t.node.eulerAngles.y;
        if (!DataManager.instance.isRun || t.brake) return;
        let temp = t.front.position.clone();
        let distance = temp.subtract(t.back.position);
        let direction = distance.normalize();
        // tổng quãng đường 
        let dis1 = Number(Vec3.distance(t.front.position, t.back.position).toFixed(0));
        // quãng đi được
        let dis2 = Number(Vec3.distance(t.front.position, t.node.position).toFixed(0));
        let per = (Number(dis2.toFixed(0)) / Number(dis1.toFixed(0))).toFixed(2);
        let per2 = t.angleY - Number(per) * t.angleY
        // console.log('di dc :' + dis2.toFixed(0) + "/" + dis1.toFixed(0) + "=" + per + "=" + per2.toFixed(1));
        if (per2 >= 0) {
            // xoay góc tính theo đoạn đường đi
            let angle = (t.back.eulerAngles.y + per2) * Math.PI / 180;
            t.node.rotation = Quat.fromAxisAngle(new Quat(), Vec3.UNIT_Y, angle);

        }

        // if (t.angleY != 0) {
        //     t.node.rotate(Quat.fromEuler(new Quat(), 0, 0.1, 0), Node.NodeSpace.LOCAL);
        //     t.angleY = Number((t.angleY - 0.1).toFixed(1))
        //     console.log(t.angleY);
        // } else {
        //     console.log("done :" + t.front.name);
        // }
        t.node.position = t.node.position.add(direction.multiplyScalar(DataManager.instance.speed));

    }

    private enterCollider(event: ITriggerEvent) {
        let t = this;
        t.km++;
    }

    private createTween() {
        let t = this;
        // let next = t.tempMap.getChildByName(t.km.toString());
        // // if (!next) return;
        // let posPM = next.position;
        // // let rosPM = next.rotation;
        // let time = (Math.abs(t.node.position.z - posPM.z)) / 30;
        // // let a = 
        // t.animation
        //     .to(time, { position: posPM })
        //     .start()
        // // t.animation.then(a).start();
        // console.log(t.animation._actions);
        let tw = tween(t.node)
        let time;
        for (let i = t.km + 1; i < t.tempMap.children.length; i++) {
            const e = t.tempMap.getChildByName(i.toString());
            const e1 = t.tempMap.getChildByName((i + 1).toString());
            let pos = e.position;
            if (i == t.km) {
                time = ((Math.abs(t.node.position.z - pos.z)) + (Math.abs(t.node.position.x - pos.x))) / 80
                tw.to(time, { position: pos }, { easing: easing.linear })
            } else if (e1) {
                time = ((Math.abs(t.node.position.z - pos.z)) + (Math.abs(t.node.position.x - pos.x))) / 120
                tw.to(time, { position: pos }, { easing: easing.linear })
            }
        }
        tw.start()

    }


    onTouchStart(e) {
        // this.run = true;
        // DataManager.instance.isRun = true;
        // this.renderSpeed(this.run);\
        // this.animation.start();
        // this.createTween();
        // this.test()
    }
    onTouchEnd(e) {
        // this.run = false;
        // DataManager.instance.isRun = false
        // this.renderSpeed(this.run)
        // Tween.stopAllByTarget(this.node)
        // this.test()
    }
    onTouchCancel(e) {
        // this.run = false;
        // DataManager.instance.isRun = false
        // this.renderSpeed(this.run)
        // Tween.stopAllByTarget(this.node)
        // this.test()
    }
    onTouchMove(e) {
        // this.run = false;
        // DataManager.instance.isRun = false
        // this.renderSpeed(this.run)
        // Tween.stopAllByTarget(this.node)
        // this.test()
    }


    downKey(event: EventKeyboard) {
        let t = this;
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:
                t.isRight = false;
                t.redirect = true;
                break;
            case KeyCode.ARROW_RIGHT:
                t.isRight = true;
                t.redirect = true;
                break;
            case KeyCode.ARROW_UP:
                t.run = true;
                DataManager.instance.isRun = true
                // this.speedMeter == 180 ? 0 : t.speedMeter += 10;
                break;
            case KeyCode.ARROW_DOWN:
                t.run = false;
                DataManager.instance.isRun = false
                break;
            case KeyCode.KEY_A:
                t.isRight = false;
                t.redirect = true;
                // t.ani.play("turnLeft");
                break;
            case KeyCode.KEY_D:
                t.isRight = true;
                t.redirect = true;
                // t.ani.play("turnRight");
                break;
            case KeyCode.KEY_W:
                t.run = true;
                DataManager.instance.isRun = true
                // this.speedMeter == 180 ? 0 : t.speedMeter += 10;
                break;
            case KeyCode.KEY_S:
                t.run = false;
                DataManager.instance.isRun = false
                break;
            default:
                t.run = false;
                DataManager.instance.isRun = false
                break;
        }
        t.powerSlide(t.redirect);
        // t.renderSpeed(t.run)
    }

    upKey(event: EventKeyboard) {
        // tween for brake but no idea
        let t = this;
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:
                t.redirect = false;
                break;
            case KeyCode.ARROW_RIGHT:
                t.redirect = false;
                break;
            case KeyCode.ARROW_UP:
                DataManager.instance.isRun = false
                t.run = false;
                // this.speedMeter == 0 ? 0 : t.speedMeter -= 10;
                break;
            case KeyCode.ARROW_DOWN:
                DataManager.instance.isRun = false
                t.run = false;
                // this.speedMeter == 0 ? 0 : t.speedMeter -= 10;
                break;
            case KeyCode.KEY_A:
                t.redirect = false;
                break;
            case KeyCode.KEY_D:
                t.redirect = false;
                break;
            default:
                DataManager.instance.isRun = false
                t.run = false;
                // this.speedMeter == 0 ? 0 : t.speedMeter -= 10;

                break;
        }
        t.powerSlide(t.redirect);
        // t.renderSpeed(t.run)
    }




    powerSlide(isActive: boolean) {

        // tween for dift
        let t = this;
        let time = 0.8;
        // Quat.fromAxisAngle(temp, Vec3.FORWARD, t.isRight ? 80 : -80);
        // Quat.fromEuler(temp, 0, t.isRight ? 70 : -70, 0);
        // temp.z += (t.isRight ? 70 : -70) * (Math.PI / 180);
        // console.log(t.temp.rotation);


        // need more anaimation
        if (isActive) {
            t.ani = tween(t.temp)
                .to(time, {
                    eulerAngles: v3(0, 0, t.isRight ? 50 : -50)
                    // , position: v3(t.isRight ? -10 : 10, 0, 0)
                }, { easing: easing.linear })
            t.ani.start();
        }
        else {
            tween(t.temp)
                .to(time, { eulerAngles: v3(0, 0, 0) }, { easing: easing.linear })
                .start();
            t.ani ? t.ani.stop() : 0;
        }


    }

    powerSpeed(isDeceleration: boolean) {
        // tween for up or down speed 
        let t = this;
    }

    // renderSpeed(isAccelerator) {
    //     // tween for meterspeed
    //     let t = this;
    //     let time = 1;
    //     if (isAccelerator) {
    //         tween(t.clockwise)
    //             .to(time, { eulerAngles: v3(0, 0, -260) }, { easing: easing.linear })
    //             .start();
    //     } else {
    //         tween(t.clockwise)
    //             .to(time, { eulerAngles: v3(0, 0, 0) }, { easing: easing.linear })
    //             .start();

    //     }

    // }



    update(deltaTime: number) {
        let t = this;
        if (DataManager.instance.isRun) {
            // const movement = new Vec3();
            // Vec3.multiplyScalar(movement, Vec3.FORWARD, -((DataManager.instance.speed) * 0.015));
            // t.node.translate(movement);
            // if (t.countAngles != 0) {
            //     let a = t.countAngles - 0.5
            //     //  t.angles * 0.0005 * DataManager.instance.speed;
            //     let b = parseFloat(a.toFixed(3));
            //     t.countAngles = b;
            //     console.log(t.countAngles);
            //     t.node.rotate(Quat.fromEuler(new Quat(), 0, 0.5, 0), Node.NodeSpace.LOCAL);
            //     t.newAngles = false;
            // }

        }

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

        // if (t.driff && this.speed != 0) {
        //     let direct = new Quat;
        //     Quat.fromAxisAngle(direct, new Vec3(0, 1, 0), t.isRight ? ((-deltaTime * t.smoothDriff) * Math.PI / 180) : ((deltaTime * t.smoothDriff) * Math.PI / 180));
        //     t.node.rotate(direct);
        // }


    }
}
