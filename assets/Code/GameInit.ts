import { _decorator, Component, PhysicsSystem2D, EPhysics2DDrawFlags } from 'cc';
const { ccclass } = _decorator;

@ccclass('GameInit')
export class GameInit extends Component {
    onLoad() {
        // 开启物理系统
        PhysicsSystem2D.instance.enable = true;
        // 调试用：开启下面这行可以看到绿色的碰撞框，正式发布请注释掉
        //PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;
    }
}