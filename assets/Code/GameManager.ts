import { _decorator, Component, Node, Prefab, instantiate, math, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({ type: Node }) mapNode: Node = null; // 拖入地图节点
    @property({ type: Prefab }) enemyPrefab: Prefab = null;
    @property({ type: Prefab }) itemPrefab: Prefab = null;
    @property({ type: Node }) enemyRoot: Node = null;
    @property({ type: Node }) itemRoot: Node = null;

    start() {
        this.spawnEntities();
    }

    spawnEntities() {
        if (!this.mapNode) return;
        const transform = this.mapNode.getComponent(UITransform);
        const w = transform.contentSize.width / 2;
        const h = transform.contentSize.height / 2;

        for (let i = 0; i < 20; i++) {
            // 在地图实际像素范围内生成，预留 50 像素边距防止贴边
            this.spawnSingle(this.enemyPrefab, this.enemyRoot, w - 50, h - 50);
            this.spawnSingle(this.itemPrefab, this.itemRoot, w - 50, h - 50);
        }
    }

    spawnSingle(prefab: Prefab, root: Node, rangeX: number, rangeY: number) {
        const node = instantiate(prefab);
        node.parent = root;
        const x = math.randomRange(-rangeX, rangeX);
        const y = math.randomRange(-rangeY, rangeY);
        node.setPosition(x, y, 0);
    }
}