import { _decorator, Component, Node, Quat, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {

    @property(Node)
    target: Node | null = null;
    Deg2Rad: number = 1;
    OffsetY: number = 1;
    OffsetZ: number = 1;
    start() {

    }

    RotationAroundNode(self: Node, pos: Vec3, axis: Vec3, angle: number): Quat {
        let t = this;
        let _quat = new Quat();
        let v1 = new Vec3();
        let v2 = new Vec3();
        let pos2: Vec3 = self.position;
        let rad = angle * t.Deg2Rad;
        Quat.fromAxisAngle(_quat, axis, rad);
        Vec3.subtract(v1, pos2, pos);
        Vec3.transformQuat(v2, v1, _quat);
        self.position = Vec3.add(v2, pos, v2);
        Quat.rotateAround(_quat, self.rotation, axis, rad);
        return _quat
    }

    Trailingbehind() {
        let t = this;
        let u = Vec3.multiplyScalar(new Vec3(), Vec3.UP, t.OffsetY);
        let f = Vec3.multiplyScalar(new Vec3(), t.target.forward, t.OffsetZ);
        let pos = Vec3.add(new Vec3(), t.target.position, u);
        Vec3.add(pos, pos, f);
        this.node.lookAt(t.target.position);


    }


    testFollow() {
        let t = this;
        if (!this.target) return;
        let posTarget = t.target.position;



    }

    update(deltaTime: number) {
        let t = this;

    }
}

