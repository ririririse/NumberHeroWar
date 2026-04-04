import { _decorator, Component, Node, Vec3, input, Input, Label, AudioSource, EventTouch, Camera, UITransform, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property({ type: Label }) numLabel: Label = null;
    @property({ type: Node }) cameraNode: Node = null;
    @property({ type: Camera }) mainCamera: Camera = null;
    @property({ type: Node }) enemyRoot: Node = null;
    @property({ type: Node }) itemRoot: Node = null;
    @property({ type: Node }) mapNode: Node = null; // 新增：拖入地图节点用于获取边界
    @property({ type: AudioSource }) eatEnemyAudio: AudioSource = null;
    @property({ type: AudioSource }) eatItemAudio: AudioSource = null;

    private currentNumber: number = 10;
    private speed: number = 400;
    private eatDistance: number = 60;
    private targetPos: Vec3 = null;
    private mapWidth: number = 0;
    private mapHeight: number = 0;

    start() {
        this.updateLabel();
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);

        // 初始化地图边界
        if (this.mapNode) {
            const transform = this.mapNode.getComponent(UITransform);
            this.mapWidth = transform.contentSize.width;
            this.mapHeight = transform.contentSize.height;
        }
    }

    onTouchStart(event: EventTouch) {
        if (!this.mainCamera) return;
        const screenLocation = event.getLocation();
        // 修正：在 2D 场景中，screenToWorld 需要传入正确的深度信息（通常为0）
        const outPos = new Vec3();
        this.mainCamera.screenToWorld(new Vec3(screenLocation.x, screenLocation.y, 0), outPos);

        // 锁定 Z 轴为 0，防止坐标偏移导致视角飞走
        this.targetPos = new Vec3(outPos.x, outPos.y, 0);
    }

    update(dt: number) {
        if (this.targetPos) {
            const currentPos = this.node.position;
            const dir = new Vec3();
            Vec3.subtract(dir, this.targetPos, currentPos);
            dir.z = 0; // 强制忽略 Z 轴干扰

            const dist = dir.length();
            if (dist > 5) {
                const step = this.speed * dt;
                dir.normalize().multiplyScalar(step);
                let nextX = currentPos.x + dir.x;
                let nextY = currentPos.y + dir.y;

                // 边界限制逻辑：限制在地图尺寸的一半范围内（假设地图中心在0,0）
                const limitX = this.mapWidth / 2;
                const limitY = this.mapHeight / 2;
                nextX = math.clamp(nextX, -limitX, limitX);
                nextY = math.clamp(nextY, -limitY, limitY);

                this.node.setPosition(nextX, nextY, 0);
            } else {
                this.targetPos = null;
            }
        }

        if (this.cameraNode) {
            // 摄像机同样需要边界限制，防止看到地图外的黑边
            const camPos = this.node.position;
            this.cameraNode.setPosition(camPos.x, camPos.y, this.cameraNode.position.z);
        }

        this.checkCollision(this.enemyRoot, true);
        this.checkCollision(this.itemRoot, false);
    }

    // ... 其余 checkCollision 和 updateLabel 保持不变 ...

    checkCollision(rootNode: Node, isEnemy: boolean) {
        if (!rootNode) return;
        const children = rootNode.children;
        for (let i = children.length - 1; i >= 0; i--) {
            const target = children[i];
            const dist = Vec3.distance(this.node.position, target.position);

            if (dist < this.eatDistance) {
                const targetScript = target.getComponent('TargetEntity') as any;
                if (targetScript) {
                    if (this.currentNumber > targetScript.value) {
                        this.currentNumber += targetScript.value;
                        this.updateLabel();
                        target.destroy();

                        if (isEnemy && this.eatEnemyAudio) this.eatEnemyAudio.play();
                        if (!isEnemy && this.eatItemAudio) this.eatItemAudio.play();
                    }
                }
            }
        }
    }

    updateLabel() {
        if (this.numLabel) {
            this.numLabel.string = this.currentNumber.toString();
        }
    }
}