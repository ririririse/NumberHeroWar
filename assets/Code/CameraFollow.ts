import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(Node)
    target: Node = null!; // 这是我们要跟随的目标（主角）

    private _tempPos = new Vec3();

    update() {
        if (this.target) {
            // 获取主角的位置
            this.target.getWorldPosition(this._tempPos);
            // 把摄像机的坐标设为主角的坐标，但保持 Z 轴在 1000（这是摄像机的默认高度）
            this.node.setWorldPosition(this._tempPos.x, this._tempPos.y, 1000);
        }
    }
}