import { _decorator, BoxCollider, CCInteger, Component, input, easing, Input, instantiate, log, Node, Prefab, Tween, tween, v3, Vec3, Label, EventKeyboard, KeyCode, Quat } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: Node })
    public PointS: Node | null = null;
    @property({ type: Node })
    public Player: Node | null = null;
    @property({ type: Node })
    public map: Node | null = null;

    @property({ type: Node })
    public goHead: Node | null = null;
    @property({ type: Node })
    public left: Node | null = null;
    @property({ type: Node })
    public right: Node | null = null;
    private isRun: boolean = false;




    // point in road
    private coll: any;
    @property({ type: Node })
    private path: Node | null = null;
    private countP: number = 0;


    // for  menu
    @property({ type: Node })
    public menuPlay: Node | null = null;
    private wise: Node | null = null;
    private displaySpeed: Node | null = null;

    start() {
        let t = this;
        t.wise = t.menuPlay.getChildByPath("clock/wise");
        t.displaySpeed = t.menuPlay.getChildByPath("clock/speed");
        t.addEvent();
        t.schedule(() => {
            t.showSpeed();
        }, 0.02)
    }

    addEvent() {
        let t = this;
        t.setUpPointStart();
        t.goHead.on(Input.EventType.TOUCH_START, t.Run, this);
        t.goHead.on(Input.EventType.TOUCH_END, t.notRun, this);
        t.goHead.on(Input.EventType.TOUCH_CANCEL, t.notRun, this);
        t.goHead.on(Input.EventType.TOUCH_MOVE, t.notRun, this);
        t.left.on(Input.EventType.TOUCH_START, t.turnLeft, this);
        t.left.on(Input.EventType.TOUCH_START, t.turnRight, this);


        input.on(Input.EventType.KEY_DOWN, t.downKey, this);

        // input.on(Input.EventType.KEY_UP, t.upKey, this);
        // t.coll = t.Player.getChildByName("coll").getComponent(BoxCollider);
        // t.coll.on('onTriggerEnter', this.goToPoint, this);


    }
    downKey(event: EventKeyboard) {
        let t = this;
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:

                break;
            case KeyCode.ARROW_RIGHT:

                break;
            case KeyCode.ARROW_UP:
                // DataManager.instance.isRun = true
                // this.speedMeter == 180 ? 0 : t.speedMeter += 10;
                break;
            case KeyCode.ARROW_DOWN:
                // DataManager.instance.isRun = false
                break;
            case KeyCode.KEY_A:
                t.turnLeft();
                // t.ani.play("turnLeft");
                break;
            case KeyCode.KEY_D:
                t.turnRight();
                // t.ani.play("turnRight");
                break;
            case KeyCode.KEY_W:
                // DataManager.instance.isRun = true
                // this.speedMeter == 180 ? 0 : t.speedMeter += 10;
                break;
            case KeyCode.KEY_S:
                // DataManager.instance.isRun = false
                break;
            default:
                // DataManager.instance.isRun = false
                break;
        }
        // t.animationSpeedMile();
    }

    upKey(event: EventKeyboard) {
        // tween for brake but no idea
        let t = this;
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:
                break;
            case KeyCode.ARROW_RIGHT:
                break;
            case KeyCode.ARROW_UP:
                DataManager.instance.isRun = false
                // this.speedMeter == 0 ? 0 : t.speedMeter -= 10;
                break;
            case KeyCode.ARROW_DOWN:
                DataManager.instance.isRun = false
                // this.speedMeter == 0 ? 0 : t.speedMeter -= 10;
                break;
            case KeyCode.KEY_A:
                break;
            case KeyCode.KEY_D:
                break;
            default:
                DataManager.instance.isRun = false
                // this.speedMeter == 0 ? 0 : t.speedMeter -= 10;

                break;
        }
        t.animationSpeedMile();
    }




    turnLeft() {
        let t = this;
        DataManager.instance.angle--;

    }

    turnRight() {
        let t = this;
        DataManager.instance.angle++;

    }


    Run() {
        let t = this
        t.isRun = true;
        DataManager.instance.isRun = true;
        t.animationSpeedMile();
    }
    notRun() {
        let t = this
        t.isRun = false;
        DataManager.instance.isRun = false;
        t.animationSpeedMile();
    }

    // set stating point
    setUpPointStart() {
        let t = this;
        if (!t.PointS) return;
        t.Player.setWorldPosition(t.PointS.position);
        // t.Player.setWorldRotation(t.PointS.rotation);

        // console.log(t.PointS.rotation);
        // let test = new Quat();
        // t.Player.setWorldRotation(Quat.fromEuler(test, 0, 149, 0));

    }
    // tween for meterspeed
    animationSpeedMile() {
        let t = this;
        let time = 1;
        Tween.stopAllByTarget(t.wise)
        if (DataManager.instance.isRun) {
            tween(t.wise)
                .to(time / 2, { eulerAngles: v3(0, 0, -130) }, { easing: easing.linear })
                // .call(() => { DataManager.instance.speed = 0.3; })
                .to(time / 2, { eulerAngles: v3(0, 0, -260) }, { easing: easing.linear })
                // .call(() => { DataManager.instance.speed = 0.6; })
                .to(time / 10, { eulerAngles: v3(0, 0, -260) }, { easing: easing.linear })
                .to(time / 10, { eulerAngles: v3(0, 0, -250) }, { easing: easing.linear })
                .start();
        } else {
            tween(t.wise)
                .to(time, { eulerAngles: v3(0, 0, 0) }, { easing: easing.linear })
                // .call(() => { DataManager.instance.speed = 0.05; })
                .start();
        }
    }
    // show label speed
    showSpeed() {
        let speed = ((57 - Math.round((this.wise.rotation.w * (180 / Math.PI)))) * 2) * 2;
        DataManager.instance.speed = speed / 500; // max 0,75
        this.displaySpeed.getComponent(Label).string = speed.toFixed(0);
    }



    update(deltaTime: number) {



    }
}

