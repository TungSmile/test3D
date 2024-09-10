import { _decorator, Component, EventMouse, Input, input, Node, Vec3, Animation, log, Button, Quat, EventKeyboard, KeyCode, math, CapsuleCollider, ICollisionEvent, ITriggerEvent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {



    @property({ type: Node })
    public accelerator: Node | null = null;
    // @property({ type: CapsuleCollider })
    // private collider: CapsuleCollider = null;
    private run: boolean = false;
    private speed: number = 10;
    private hasRun: number = 0;
    private carPos: Vec3 = new Vec3(0, 0, 1);
    private redirect: boolean = false;
    private rotationCar: Quat = new Quat();
    private isRight: boolean = false;

    start() {
        // Your initialization goes here.
        // input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        // this.collider = this.node.getComponent(CapsuleCollider);
        this.accelerator.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.accelerator.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.accelerator.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.accelerator.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.KEY_DOWN, this.gohead, this);
        input.on(Input.EventType.KEY_UP, this.brake, this);
        // this.collider.on('onCollisionStay', this.onCollision, this);
        // this.collider.on('onTriggerStay', this.onTriggerStay, this);

    }

    private onCollision(event: ICollisionEvent) {
        console.log(event.type, event);
    }
    private onTriggerStay(event: ITriggerEvent) {
        console.log(event.type, event);
    }

    onTouchStart(e) {
        this.run = true;
    }
    onTouchEnd(e) {
        this.run = false;
    }
    onTouchCancel(e) {
        this.run = false;
    }
    onTouchMove(e) {
        this.run = false;
    }


    gohead(event: EventKeyboard) {
        let t = this;
        console.log(t.hasRun);
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
                break;
            case KeyCode.ARROW_DOWN:
                t.run = false;
                break;
            case KeyCode.KEY_A:
                t.isRight = false;
                t.redirect = true;
                break;
            case KeyCode.KEY_D:
                t.isRight = true;
                t.redirect = true;
                break;
            case KeyCode.KEY_W:
                t.run = true;
                break;
            case KeyCode.KEY_S:
                t.run = false;
                break;
        }
    }

    brake(event: EventKeyboard) {
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
                break;
            case KeyCode.ARROW_DOWN:
                t.run = false;
                break;
            case KeyCode.KEY_A:
                t.redirect = false;
                break;
            case KeyCode.KEY_D:
                t.redirect = false;
                break;
            default:
                t.run = false;
                break;

        }
    }



    update(deltaTime: number) {
        let t = this;
        if (t.run) {
            const movement = new Vec3();
            t.speed <= 40 ? t.speed += 0.05 : 0;
            Vec3.multiplyScalar(movement, t.carPos, t.speed * deltaTime);
            t.node.translate(movement);

            // t.hasRun += t.speed;
            // Vec3.add(t.carPos, t.carPos, new Vec3(0, 0, t.hasRun / 2000));
            // this.node.translate(t.carPos);

        } else {
            t.speed >= 10 ? t.speed -= 0.05 : 0;
        }
        if (t.redirect) {
            Quat.fromAxisAngle(t.rotationCar, Vec3.UP, t.isRight ? ((-deltaTime * 100) * Math.PI / 180) : ((deltaTime * 100) * Math.PI / 180));
            t.node.rotate(t.rotationCar)
        }

    }
}
