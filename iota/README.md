# Integrate Example

`iota/integrate_example/periphery` 展示了一個第三方專案如何與 LiquidLink incentive system 串接：建立 `PointCap` 的保管物件、從共享 `Scoreboard` 增減點數，以及示範固定比例的消費累積與時間權重獎勵。

## 前置需求

- IOTA Move CLI（或 Sui CLI，依鏈選擇）
- 已部署的 `liquidlink_incenctive_system` 套件與 `ProtocolAdminCap`

## 操作流程

1. **建置並發佈核心合約**

   ```sh
   cd iota/liquidlink_incenctive_system
   iota move build
   iota client publish --gas-budget 500000000
   ```

   記下輸出的 `PACKAGE_ID` 以及 `ProtocolAdminCap` 物件。

2. **建立專案能力**

   ```sh
   iota client call --package <CORE_PACKAGE_ID> \
     --module router \
     --function create_incentive_system \
     --args <PROTOCOL_ADMIN_CAP_ID> <PROJECT_OWNER_ADDRESS> \
     --gas-budget 200000000
   ```

   呼叫會轉給 `ProjectCap` 與 `PointCap` 持有者（`PROJECT_OWNER_ADDRESS`）。

3. **為專案建立 Scoreboard**

   ```sh
   # kind: 0 = 一般加減分, 1 = 線性時間權重
   iota client call --package <CORE_PACKAGE_ID> \
     --module router \
     --function entry_create_scoreboard \
     --args <PROJECT_CAP_ID> 0 \
     --gas-budget 200000000
   ```

   交易會輸出新的共享 `Scoreboard` 物件 ID，後續交易需以 `--object-id` 形式帶入。

4. **發佈並初始化 periphery example**

   ```sh
   cd ../integrate_example/periphery
   iota move build
   iota client publish --gas-budget 500000000
   ```

   發佈後會得到 `PERIPHERY_PACKAGE_ID` 與 `YourAdminCap`。

5. **把 `PointCap` 放入 `CapStore` 共享物件**

   ```sh
   iota client call --package <PERIPHERY_PACKAGE_ID> \
     --module periphery \
     --function new_cap_store \
     --args <YOUR_ADMIN_CAP_ID> <POINT_CAP_ID> \
     --gas-budget 100000000
   ```

   記錄輸出的 `CapStore` 物件 ID。整合應用只需持有 `CapStore`；其餘交易參數為 `Scoreboard` 物件。

6. **執行 demo 交易**

   ```sh
   # 任意加點
   iota client call --package <PERIPHERY_PACKAGE_ID> \
     --module periphery \
     --function award_points \
     --args <CAP_STORE_ID> <SCOREBOARD_ID> 50 \
     --gas-budget 100000000

   # 針對消費自動換算點數（每單位 10 點）
   iota client call --package <PERIPHERY_PACKAGE_ID> \
     --module periphery \
     --function reward_purchase \
     --args <CAP_STORE_ID> <SCOREBOARD_ID> 3 \
     --gas-budget 100000000

   # 退款或違規的扣點
   iota client call --package <PERIPHERY_PACKAGE_ID> \
     --module periphery \
     --function claw_back_points \
     --args <CAP_STORE_ID> <SCOREBOARD_ID> 5 \
     --gas-budget 100000000

   # 線性時間獎勵：scoreboard kind 必須為 1，Clock 物件使用鏈上提供者 (例如 IOTA 為 0x6)
   iota client call --package <PERIPHERY_PACKAGE_ID> \
     --module periphery \
     --function start_linear_reward \
     --args <CAP_STORE_ID> <LINEAR_SCOREBOARD_ID> 100 60000 0x6 \
     --gas-budget 200000000
   ```

   `start_linear_reward` / `update_linear_reward` 會依照 `score_per_duration` 與 `duration`（毫秒）自動累積點數；查詢時只需讀取 `Scoreboard` 物件狀態。

## 測試

`periphery/tests/periphery_tests.move` 提供最小化單元測試，模擬：
- 儲存 `PointCap` 並從共享 Scoreboard 加點
- 套用 demo `reward_purchase` 邏輯
- 扣點流程

於 `iota/integrate_example/periphery` 目錄執行：

```sh
iota move test
```

若要在自己專案中套用，只需複製 `CapStore` 與 `award_points / claw_back_points` 等 helper，並替換為業務邏輯即可。
