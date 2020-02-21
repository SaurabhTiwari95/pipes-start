import {
  trigger,
  animate,
  style,
  group,
  query,
  transition
} from "@angular/animations";

export const anima = trigger("leave", [
  transition("none => 1", [
    query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
      optional: true
    }),
    group([
      query(
        ":enter",
        [
          style({ transform: "translateX(100%)" }),
          animate("0.3s ease-in-out", style({ transform: "translateX(0%)" }))
        ],
        { optional: true }
      ),
      query(
        ":leave",
        [
          style({ transform: "translateX(0%)" }),
          animate("0.3s ease-in-out", style({ transform: "translateX(-100%)" }))
        ],
        { optional: true }
      )
    ])
  ]),
  transition("1 => none", [
    query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
      optional: true
    }),
    group([
      query(
        ":enter",
        [
          style({ transform: "translateX(+100%)" }),
          animate("0.3s ease-in-out", style({ transform: "translateX(0%)" }))
        ],
        { optional: true }
      ),
      query(
        ":leave",
        [
          style({ transform: "translateX(0%)" }),
          animate("0.3s ease-in-out", style({ transform: "translateX(-100%)" }))
        ],
        { optional: true }
      )
    ])
  ]),
  transition("1 => step1", [
    query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
      optional: true
    }),
    group([
      query(
        ":enter",
        [
          style({ transform: "translateX(+100%)" }),
          animate("0.3s ease-in-out", style({ transform: "translateX(0%)" }))
        ],
        { optional: true }
      ),
      query(
        ":leave",
        [
          style({ transform: "translateX(0%)" }),
          animate("0.3s ease-in-out", style({ transform: "translateX(-100%)" }))
        ],
        { optional: true }
      )
    ])
  ]),
  transition("step1 => step2", [
    query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
      optional: true
    }),
    group([
      query(
        ":enter",
        [
          style({ transform: "translateX(+100%)" }),
          animate("0.3s ease-in-out", style({ transform: "translateX(0%)" }))
        ],
        { optional: true }
      ),
      query(
        ":leave",
        [
          style({ transform: "translateX(0%)" }),
          animate("0.3s ease-in-out", style({ transform: "translateX(-100%)" }))
        ],
        { optional: true }
      )
    ])
  ]),
  transition("step2 => step3", [
    query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
      optional: true
    }),
    group([
      query(
        ":enter",
        [
          style({ transform: "translateX(+100%)" }),
          animate("0.3s ease-in-out", style({ transform: "translateX(0%)" }))
        ],
        { optional: true }
      ),
      query(
        ":leave",
        [
          style({ transform: "translateX(0%)" }),
          animate("0.3s ease-in-out", style({ transform: "translateX(-100%)" }))
        ],
        { optional: true }
      )
    ])
  ]),
]);
