import { _decorator, Component, EventMouse, Input, input, Node, Vec3, Animation, log, Button, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use the `property` decorator if you want the member to be serializable */
    // @property
    // serializableDummy = 0;

    // for fake tween
    // Whether the jump command is received or not
    private _startJump: boolean = false;
    // Jump step length
    private _jumpStep: number = 0.0;
    // current jump time
    private _curJumpTime: number = 0.0;
    // length of each jump
    private _jumpTime: number = 0.1;
    // current jump speed
    private _curJumpSpeed: number = 0.0;
    // current character position
    private _curPos: Vec3 = new Vec3();
    // the difference in position of the current frame movement during each jump
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    // target position of the character
    private _targetPos: Vec3 = new Vec3();
    private _isMoving = false;

    @property({ type: Animation })
    public BodyAnim: Animation | null = null;

    @property({ type: Node })
    public accelerator: Node | null = null;


    private run: boolean = false;
    private speed: number = 1;
    private hasRun: number = 0;
    private carPos: Vec3 = new Vec3(0, 0, 0);
    private frameBySecond: number = 0.00;
    // rate for smooth of frame (min to smooth)
    private timeRun: number = 0.01;
    private carRot: Vec3 = new Vec3(0, 0, 0);

    start() {
        // Your initialization goes here.
        // input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        this.accelerator.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.accelerator.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.accelerator.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.accelerator.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);

    }


    onTouchStart(e) {
        console.log("s", this.carPos);
        console.log("km", this.hasRun);

        this.run = true;
    }
    onTouchEnd(e) {
        console.log("e", this.carPos);
        this.run = false;
    }
    onTouchCancel(e) {
        console.log("e", this.carPos);
        this.run = false;
    }
    onTouchMove(e) {
        console.log("e", this.carPos);
        this.run = false;
    }

    setInputActive(active: boolean) {
        if (active) {
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        } else {
            input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.jumpByStep(1);
        }
        else if (event.getButton() === 2) {
            this.jumpByStep(2);
        }

    }

    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }
        this._startJump = true;
        this._jumpStep = step;
        this._curJumpTime = 0;
        this._curJumpSpeed = this._jumpStep / this._jumpTime;
        this.node.getPosition(this._curPos);
        Vec3.add(this._targetPos, this._curPos, new Vec3(0, 0, -this._jumpStep));
        // Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep, 0, 0));
        this._isMoving = true;
        // if (this.BodyAnim) {
        //     if (step === 1) {
        //         this.BodyAnim.play('oneStep');
        //     } else if (step === 2) {
        //         this.BodyAnim.play('twoStep');
        //     }
        // }

    }

    gohead(event: EventMouse) {

    }

    onOnceJumpEnd() {
        this._isMoving = false;
    }

    update(deltaTime: number) {
        // if (this._startJump) {
        //     this._curJumpTime += deltaTime;
        //     if (this._curJumpTime > this._jumpTime) {
        //         // end
        //         this.node.setPosition(this._targetPos);
        //         this._startJump = false;
        //     } else {
        //         // tween
        //         this.node.getPosition(this._curPos);
        //         this._deltaPos.x = this._curJumpSpeed * deltaTime;
        //         Vec3.add(this._curPos, this._curPos, this._deltaPos);
        //         this.node.setPosition(this._curPos);
        //     }
        // }

        let t = this;
        if (t.run) {
            t.frameBySecond += deltaTime;
            if (t.frameBySecond >= t.timeRun) {
                t.hasRun += t.speed;
                // if (t.hasRun == 20) {
                //     t.node.setRotationFromEuler(new Vec3(this.node.rotation.x, -15, this.node.rotation.z));
                // }

                Vec3.add(t.carPos, t.carPos, new Vec3(0, 0, t.hasRun / 1000));
                this.node.setPosition(t.carPos);
                t.frameBySecond = 0;
            }
        }
    }
}
