import { _decorator, Component, EventMouse, Input, input, Node, Vec3, Quat, EventKeyboard, KeyCode, ICollisionEvent, ITriggerEvent, tween, easing, v3, Label, BoxCollider } from 'cc';
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

    private run: boolean = false;
    private speed: number = 0;
    private redirect: boolean = false;
    private isRight: boolean = false;
    private ani;

    start() {
        let collider = this.node.getComponent(BoxCollider);
        collider.on('onTriggerEnter', this.onTriggerStay, this);
        // this.accelerator.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        // this.accelerator.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        // this.accelerator.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        // this.accelerator.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.KEY_DOWN, this.downKey, this);
        input.on(Input.EventType.KEY_UP, this.upKey, this);

        this.schedule(() => {
            this.speed = ((57 - Math.round((this.clockwise.rotation.w * (180 / Math.PI)))) * 2)
            this.numberSpeed.getComponent(Label).string = this.speed.toFixed(0);
        }, 0.3);


    }

    private onCollision(event: ICollisionEvent) {
        console.log(event.type, event);
    }
    private onTriggerStay(event: ITriggerEvent) {
        let t = this;

        // let direct = new Quat;
        // Quat.fromAxisAngle(direct, Vec3.UP, -(Math.PI / 180 * 3));
        // t.node.rotate(direct);
        let temp = Number(event.otherCollider.node.name);
        tween(t.node).by(0.5, {
            eulerAngles: v3(0, -temp, 0)
        }, { easing: easing.linear })
            .start()
        console.log("va");

    }

    onTouchStart(e) {
        this.run = true;
        this.renderSpeed(this.run);


    }
    onTouchEnd(e) {
        this.run = false;
        this.renderSpeed(this.run)

    }
    onTouchCancel(e) {
        this.run = false;
        this.renderSpeed(this.run)

    }
    onTouchMove(e) {
        this.run = false;
        this.renderSpeed(this.run)

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
                // this.speedMeter == 180 ? 0 : t.speedMeter += 10;
                break;
            case KeyCode.ARROW_DOWN:
                t.run = false;
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
                // this.speedMeter == 180 ? 0 : t.speedMeter += 10;
                break;
            case KeyCode.KEY_S:
                t.run = false;
                break;
            default:
                t.run = false;
                break;
        }
        t.powerSlide(t.redirect);
        t.renderSpeed(t.run)
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
                t.run = false;
                // this.speedMeter == 0 ? 0 : t.speedMeter -= 10;
                break;
            case KeyCode.ARROW_DOWN:
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
                t.run = false;
                // this.speedMeter == 0 ? 0 : t.speedMeter -= 10;

                break;
        }
        t.powerSlide(t.redirect);
        t.renderSpeed(t.run)
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
                    , position: v3(t.isRight ? -10 : 10, 0, 0)
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

    renderSpeed(isAccelerator) {
        // tween for meterspeed
        let t = this;
        let time = 1;
        if (isAccelerator) {
            tween(t.clockwise)
                .to(time, { eulerAngles: v3(0, 0, -260) }, { easing: easing.linear })
                .start();
        } else {
            tween(t.clockwise)
                .to(time, { eulerAngles: v3(0, 0, 0) }, { easing: easing.linear })
                .start();

        }

    }



    update(deltaTime: number) {
        let t = this;
        if (t.run) {
            const movement = new Vec3();
            Vec3.multiplyScalar(movement, Vec3.FORWARD, -((this.speed / 4) * deltaTime));
            t.node.translate(movement);
        }


        // if (t.redirect) {
        //     // tween is better :))
        //     let direct = new Quat;
        //     let rotationCar = new Quat;
        //     Quat.fromAxisAngle(direct, Vec3.FORWARD, t.isRight ? ((-deltaTime * 100) * Math.PI / 180) : ((deltaTime * 100) * Math.PI / 180));
        //     t.temp.rotate(direct);
        //     Quat.fromAxisAngle(rotationCar, Vec3.UP, t.isRight ? ((-deltaTime * 100) * Math.PI / 180) : ((deltaTime * 100) * Math.PI / 180));
        //     t.node.rotate(rotationCar);
        //     // const movement = t.temp.position.clone();
        //     // let temp = movement.x > 3 || movement.x < -3 ? -0.01 : 0.01
        //     // Vec3.multiplyScalar(movement, new Vec3(1, 0, 0), t.isRight ? temp * -1 : temp);
        //     // t.controllDirect.translate(movement);

        // }

    }
}
