import { _decorator, Component, Node, input, Input, EventTouch, Vec3, Vec2, screen } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerMove')
export class PlayerMove extends Component {

    @property
    speed: number = 300; // 移动速度

    private _isMoving: boolean = false;
    private _targetPos: Vec3 = new Vec3(); // 目标点击位置
    private _moveDir: Vec3 = new Vec3();   // 移动方向向量

    onLoad() {
        // 注册触摸事件
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    // 触摸开始：计算方向并开始移动
    onTouchStart(event: EventTouch) {
        this._isMoving = true;
        this.updateTargetDirection(event);
    }

    // 触摸滑动：实时更新移动方向
    onTouchMove(event: EventTouch) {
        this.updateTargetDirection(event);
    }

    // 触摸结束：停止移动
    onTouchEnd() {
        this._isMoving = false;
    }

    // 将屏幕坐标转换为 UI 世界坐标，并计算移动向量
    updateTargetDirection(event: EventTouch) {
        // 获取触摸点的屏幕坐标
        const touchPos = event.getLocation();

        // 核心：计算点击位置相对于角色位置的方向
        // 注意：由于 Canvas 是中心对齐，需要简单换算或直接取方向
        let playerPos = this.node.worldPosition;

        // 简单的逻辑：点击左侧向左，点击右侧向右
        // 获取屏幕中心点（通常是相机视角中心）
        let centerX = screen.windowSize.width / 2;
        let centerY = screen.windowSize.height / 2;

        this._moveDir.x = touchPos.x - centerX;
        this._moveDir.y = touchPos.y - centerY;
        this._moveDir.z = 0;

        // 归一化，只保留方向
        this._moveDir.normalize();
    }

    update(dt: number) {
        if (this._isMoving) {
            // 计算位移：方向 * 速度 * 时间
            let displacement = this._moveDir.clone().multiplyScalar(this.speed * dt);
            let currentPos = this.node.position;

            // 设置新位置
            this.node.setPosition(
                currentPos.x + displacement.x,
                currentPos.y + displacement.y,
                currentPos.z
            );

            // 可选：根据移动方向翻转角色图片（左移翻转，右移正常）
            if (this._moveDir.x < 0) {
                this.node.setScale(-1, 1, 1); // 向左
            } else if (this._moveDir.x > 0) {
                this.node.setScale(1, 1, 1);  // 向右
            }
        }
    }
}