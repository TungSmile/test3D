import { _decorator, CCInteger, Component, easing, Input, instantiate, Node, Prefab, tween } from 'cc';
const { ccclass, property } = _decorator;
enum BlockType {
    BT_NONE,
    BT_STONE,
};

enum GameState {
    GS_INIT,
    GS_PLAYING,
    GS_END,
};
@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: Node })
    public PointS: Node | null = null;
    @property({ type: Node })
    public Player: Node | null = null;
    @property({ type: Node })
    public map: Node | null = null;
    private pointMap: Node = null;
    // private road: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    private countPoint: number = 1
    private nextPoint: boolean = true;
    @property({ type: Node })
    public goHead: Node | null = null;
    private isRun: boolean = false;


    start() {
        let t = this;
        t.getPlayerToPointS();
        t.addPointCheck();
        t.goHead.on(Input.EventType.TOUCH_START, t.Run, this);
        t.goHead.on(Input.EventType.TOUCH_END, t.notRun, this);
        t.goHead.on(Input.EventType.TOUCH_CANCEL, t.notRun, this);
        t.goHead.on(Input.EventType.TOUCH_MOVE, t.notRun, this);
    }


    getPlayerToPointS() {
        let t = this;
        if (!t.PointS || !t.Player) return;
        t.Player.setWorldPosition(t.PointS.position);
        t.Player.setWorldRotation(t.PointS.rotation);
    }

    addPointCheck() {
        let t = this;
        t.pointMap = t.map.getChildByName(t.countPoint.toString());
        if (!t.pointMap) return;
        console.log(t.pointMap.name);
        t.countPoint < 3 ? t.countPoint++ : 0;
    }

    runToPoint() {
        let t = this;
        if (!t.nextPoint) return;
        if (!t.pointMap) return;
        let posPM = t.pointMap.position;
        let rosPM = t.pointMap.rotation;
        let time = 0.5;
        t.nextPoint = false;
        tween(t.Player)
            .to(time, { rotation: rosPM, position: posPM }, { easing: easing.linear })
            .call(() => {
                t.addPointCheck();
                t.nextPoint = true;
            })
            .union()
            .start();
    }

    Run() {
        this.isRun = true
    }
    notRun() {
        this.isRun = false

    }


    update(deltaTime: number) {
        this.isRun ? this.runToPoint() : 0;
    }
}

