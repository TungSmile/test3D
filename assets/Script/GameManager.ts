import { _decorator, BoxCollider, CCInteger, Component, easing, Input, instantiate, log, Node, Prefab, Tween, tween, v3, Vec3 } from 'cc';
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
    private pointMap: Node = null;
    private animationRun = null;
    private animationStop = null
    private nextPoint: boolean = true;
    @property({ type: Node })
    public goHead: Node | null = null;
    private isRun: boolean = false;
    private isPlayer: boolean = true;
    // point in road
    private currentIndex = 0;
    private coll: any;
    @property({ type: Node })
    private path: Node | null = null;
    private countP: number = 0;
    start() {
        let t = this;
        t.isPlayer ? t.addEvent() : 0;
        t.coll = t.Player.getChildByName("coll").getComponent(BoxCollider);
        t.coll.on('onTriggerEnter', this.goToPoint, this);
    }

    addEvent() {
        let t = this;
        t.getPlayerToPointS();
        t.goHead.on(Input.EventType.TOUCH_START, t.Run, this);
        t.goHead.on(Input.EventType.TOUCH_END, t.notRun, this);
        t.goHead.on(Input.EventType.TOUCH_CANCEL, t.notRun, this);
        t.goHead.on(Input.EventType.TOUCH_MOVE, t.notRun, this);

    }

    goToPoint() {
        let t = this;
        t.countP++;
        console.log('a');
        t.isRun ? t.runTest() : 0;
    }

    runTest() {
        // frame so lag
        let t = this;
        let point: Node = t.path.getChildByName(t.countP.toString());
        let posPM = point.position;
        let rosPM = point.rotation;
        let time = (Math.abs(t.Player.position.z - posPM.z)) / 20;
        console.log(time);
        tween(t.Player).to(time, { rotation: rosPM, position: posPM }, { easing: easing.linear }).start();
    }

    getPlayerToPointS() {
        let t = this;
        if (!t.PointS || !t.Player) return;
        t.Player.setWorldPosition(t.PointS.position);
        t.Player.setWorldRotation(t.PointS.rotation);
        // add tween
        // t.animationRun = tween(t.Player)

    }

    // runToPoint() {
    //     let t = this;
    //     // t.animationRun ? t.animationRun.stop() : 0;
    //     // Tween.stopAll();
    //     // t.animationRun.stop();

    //     // t.animationStop ? t.animationStop.stop() : 0;
    //     // if (!t.nextPoint) return;
    //     // t.nextPoint = false;
    //     // let posPM = t.path[t.currentIndex].position;
    //     // let rosPM = t.path[t.currentIndex].rotation;
    //     let time = 1;

    //     // tween(t.Player)
    //     //     .to(time, { rotation: rosPM, position: posPM }, { easing: easing.linear })
    //     //     .call(() => {
    //     //         t.currentIndex++;
    //     //         t.nextPoint = true;
    //     //         t.currentIndex >= t.path.length ? t.currentIndex = 0 : 0
    //     //     })
    //     //     .start();

    //     // if (t.currentIndex >= t.path.length) {
    //     //     t.currentIndex = 0;
    //     // }

    //     let temp = tween(t.Player);
    //     t.currentIndex++;
    //     t.currentIndex >= t.path.length ? t.currentIndex = 0 : 0;
    //     // console.log(t.path.length, t.currentIndex);

    //     for (let i = t.currentIndex; i < t.path.length; i++) {
    //         // t.animationRun =

    //         temp
    //             // t.animationRun
    //             .to(time, {
    //                 rotation: t.path[i].rotation,
    //                 position: t.path[i].position
    //             }, { easing: easing.linear })
    //             .call(() => {

    //                 t.currentIndex++;
    //             });
    //     }

    //     temp.start();
    //     // console.log(t.animationRun.start());

    //     // if (!t.nextPoint) return;
    //     // if (!t.pointMap) return;
    //     // let posPM = t.pointMap.position;
    //     // let rosPM = t.pointMap.rotation;
    //     // let time = 0.3;
    //     // t.nextPoint = false;
    //     // tween(t.Player)
    //     //     .to(time, { rotation: rosPM, position: posPM }, { easing: easing.linear })
    //     //     .call(() => {
    //     //         t.addPointCheck();
    //     //         t.nextPoint = true;
    //     //     })
    //     //     .union()
    //     //     .start();

    // }
    reduceSpeed() {
        let t = this;
        // t.animationRun.stop();
        let time = 1;
        // t.animationRun
        if (t.currentIndex >= t.path.length) return;
        tween(t.Player)
            .to(time, {
                rotation: t.path[t.currentIndex].rotation,
                position: t.path[t.currentIndex].position
            }, { easing: easing.linear })
            .start()

    }

    Run() {
        this.isRun = true;
        // Tween.stopAll()
        // this.runToPoint();
        // this.runTest();
    }
    notRun() {
        this.isRun = false;
        Tween.stopAll()
        // this.reduceSpeed();

    }


    update(deltaTime: number) {
        // this.isRun && this.animation != null ? this.animation.resume() : this.animation.pause();
    }
}

