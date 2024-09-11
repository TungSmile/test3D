import { _decorator, CCInteger, Component, instantiate, Node, Prefab } from 'cc';
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

    private _curState: GameState = GameState.GS_INIT;

    start() {
        let t = this;
        t.getPlayerToPointS();
    }


    getPlayerToPointS() {
        let t = this;
        if (!t.PointS || !t.Player) return;
        t.Player.setWorldPosition(t.PointS.position);
        t.Player.setWorldRotation(t.PointS.rotation);
    }






    update(deltaTime: number) {

    }
}

