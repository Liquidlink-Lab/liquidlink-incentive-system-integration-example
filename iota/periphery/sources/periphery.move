module periphery::periphery;

use iota::clock::Clock;
use liquidlink_incenctive_system::router;
use liquidlink_incenctive_system::scoreboard::{PointCap, Scoreboard};

const POINTS_PER_PURCHASE_UNIT: u64 = 10;

public struct YourAdminCap has key, store {
    id: UID
}

public struct CapStore has key {
    id: UID,
    cap: PointCap
}

fun init(ctx: &mut TxContext) {
    let my_admin_cap = YourAdminCap {
        id: object::new(ctx)
    };
    transfer::public_transfer(my_admin_cap, ctx.sender());
}

/// Store a `PointCap` inside a shared object so integration contracts can borrow it.
public entry fun new_cap_store(_your_admin_cap: &YourAdminCap, cap: PointCap, ctx: &mut TxContext) {
    let cap_store = CapStore {
        id: object::new(ctx),
        cap
    };
    transfer::share_object(cap_store);
}

public(package) fun borrow_cap(cap_store: &CapStore): &PointCap {
    &cap_store.cap
}

/// Generic helper to add arbitrary points on behalf of the transaction sender.
public entry fun award_points(
    cap_store: &CapStore,
    scoreboard: &mut Scoreboard,
    amount: u64,
    ctx: &mut TxContext
) {
    let cap = borrow_cap(cap_store);
    router::add_point(cap, scoreboard, amount, ctx);
}

/// Removes points when a purchase is refunded or a user violates the rules.
public entry fun claw_back_points(
    cap_store: &CapStore,
    scoreboard: &mut Scoreboard,
    amount: u64,
    ctx: &mut TxContext
) {
    let cap = borrow_cap(cap_store);
    router::subtract_point(cap, scoreboard, amount, ctx);
}

/// Demo: reward a purchase at a fixed rate (`POINTS_PER_PURCHASE_UNIT` per token spent).
public entry fun reward_purchase(
    cap_store: &CapStore,
    scoreboard: &mut Scoreboard,
    purchase_value: u64,
    ctx: &mut TxContext
) {
    let reward = purchase_value * POINTS_PER_PURCHASE_UNIT;
    award_points(cap_store, scoreboard, reward, ctx);
}

/// Kick off a linear-time staking reward scoreboard (scoreboard kind must be linear).
public entry fun start_linear_reward(
    cap_store: &CapStore,
    scoreboard: &mut Scoreboard,
    score_per_duration: u64,
    duration: u64,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let cap = borrow_cap(cap_store);
    router::set_linear_time_point(cap, scoreboard, score_per_duration, duration, clock, ctx);
}

/// Update the linear-time reward parameters while keeping accumulated points.
public entry fun update_linear_reward(
    cap_store: &CapStore,
    scoreboard: &mut Scoreboard,
    score_per_duration: u64,
    duration: u64,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let cap = borrow_cap(cap_store);
    router::update_linear_time_point(cap, scoreboard, score_per_duration, duration, clock, ctx);
}
