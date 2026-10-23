window.ARCADE_MACHINES_DATA = {
  "categories": [
    {
      "id": "redemption",
      "name": "Redemption Games",
      "icon": "🎟️",
      "color": "#66fcf1",
      "description": "Skill-based ticket-dispensing games where players exchange ticket winnings for prizes at redemption counters."
    },
    {
      "id": "merchandiser",
      "name": "Merchandiser Games",
      "icon": "🎁",
      "color": "#ff6ec7",
      "description": "Direct prize-winning attractions including claw cranes, UFO catchers, coin pushers, and precision key machines."
    },
    {
      "id": "pinball",
      "name": "Pinball Machines",
      "icon": "🔮",
      "color": "#bf5fff",
      "description": "Electromechanical kinetic marvels blending physical ball physics, ramps, bumpers, multiball modes, and deep rulesets."
    },
    {
      "id": "rhythm",
      "name": "Rhythm & Music",
      "icon": "🎵",
      "color": "#00ff88",
      "description": "Beat-matching, drum-tapping, sensor-touching, and dance-stage arcade games popular in arcades worldwide."
    },
    {
      "id": "racing",
      "name": "Racing & Driving",
      "icon": "🏎️",
      "color": "#ff9900",
      "description": "High-octane cockpit simulators with force-feedback steering, manual shifters, drift physics, and linked multiplayer."
    },
    {
      "id": "shooter",
      "name": "Action & Gun Shooters",
      "icon": "💥",
      "color": "#ff3333",
      "description": "Light gun rail shooters and mounted cannon cabinets featuring sensory surround sound, recoil, and theater enclosures."
    }
  ],
  "machines": [
    {
      "id": "skee-ball",
      "category": "redemption",
      "name": "Skee-Ball Classic",
      "tagline": "The Century-Old Legend of Kinetic Skill.",
      "description": "Invented in 1908 by J.D. Estes, Skee-Ball is the quintessential redemption arcade game. Players roll wooden or solid composite balls up an inclined ramp over a 'ball-hop' jump into targeted concentric bullseye rings.",
      "tickets_per_play": "10–150 Tickets",
      "difficulty": "Easy",
      "players": "1",
      "manufacturer": "Bay Tek Entertainment / Skee-Ball Inc.",
      "tips": [
        "Commit to the 40-point ring on your dominant arm side for maximum consistency.",
        "Use a smooth low-release underhand delivery; high-velocity throws bounce wildly off target rings.",
        "Nine steady 40-point rolls beat one lucky 100-point shot surrounded by misses."
      ],
      "strategy": "Center-line precision: stand slightly offset from center to align your rolling arm squarely with the channel ramp. Release at the lowest point of your swing.",
      "color": "#66fcf1"
    },
    {
      "id": "basketball-shoot",
      "category": "redemption",
      "name": "Pop-A-Shot Basketball",
      "tagline": "Rapid-Fire Free Throw Showdown.",
      "description": "Created in 1981, Pop-A-Shot invented the electronic basketball arcade genre. Features infrared shot sensors, a net return ramp, digital countdown clocks, and progressive bonus point stages.",
      "tickets_per_play": "20–250 Tickets",
      "difficulty": "Medium",
      "players": "1–2",
      "manufacturer": "Pop-A-Shot Enterprises",
      "tips": [
        "Never wait for a ball to drop through the net: always keep a ball chambered in your secondary hand.",
        "Aim for the upper center square of the backboard rather than swishing the rim.",
        "Sprint during the final 15 seconds when basket point values double or triple."
      ],
      "strategy": "Two-ball cadence: establish a 1.2-second shooting tempo. Your eyes should remain locked on the backboard square while your hands work automatically.",
      "color": "#ff9900"
    },
    {
      "id": "quik-drop",
      "category": "redemption",
      "name": "Quik Drop",
      "tagline": "Precision Ball Dropping Frenzy.",
      "description": "One of the most popular modern redemption cabinets in arcades worldwide. Players press a mechanical button to drop bouncing balls through a central dropper into rotating numbered buckets below.",
      "tickets_per_play": "10–500 (Jackpot)",
      "difficulty": "Hard",
      "players": "1",
      "manufacturer": "Bay Tek Entertainment",
      "tips": [
        "Drop in bursts of 4 to 5 balls per bucket as each bucket glides underneath the drop chute.",
        "Watch the drop travel delay: balls take ~0.35s to hit the bottom of the bucket.",
        "Fill the early buckets cleanly so you have leftover balls and buffer time for the final buckets."
      ],
      "strategy": "Catch the bucket lip: release your 4-ball tap sequence just as the leading edge of the bucket crosses under the center tube nozzle.",
      "color": "#ffcc00"
    },
    {
      "id": "whack-a-mole",
      "category": "redemption",
      "name": "Whack-A-Mole",
      "tagline": "Pure Reflex Reaction Testing.",
      "description": "The timeless 1970s reaction classic. Mechanical moles pop out of five or nine holes via pneumatic solenoids at randomized intervals, challenging players to strike them down before they retract.",
      "tickets_per_play": "10–100 Tickets",
      "difficulty": "Easy",
      "players": "1",
      "manufacturer": "Bob's Space Racers",
      "tips": [
        "Grip the mallet at the middle balance point rather than the bottom tip.",
        "Divide the playfield into visual zones; let your peripheral vision trigger arm reflexes.",
        "Never swing twice at a retreating mole; immediately reset to center position."
      ],
      "strategy": "Neutral center stance: hover the mallet 10cm above the central mole hole so all perimeter holes require equal minimum travel distance.",
      "color": "#66fcf1"
    },
    {
      "id": "stacker",
      "category": "redemption",
      "name": "Stacker Giant",
      "tagline": "LED Precision Tower Climbing.",
      "description": "Lighthouse LED block-stacking game by LAI Games. Players align horizontal sliding light blocks on a vertical matrix. Reaching the Minor Prize level offers modest tickets, while the Major Prize requires pixel-perfect accuracy.",
      "tickets_per_play": "5–MAJOR (Tickets or Prize)",
      "difficulty": "Hard",
      "players": "1",
      "manufacturer": "LAI Games",
      "tips": [
        "Compensate for mechanical button latency: press ~30 milliseconds before visual alignment.",
        "Keep your eyes on the outer edge boundary rather than the middle of the light block.",
        "The block speed jumps noticeably at row 5 and row 10."
      ],
      "strategy": "Internal metronome: bob your hand to the bounce beat of the blocks across the wall to anticipate the center alignment stroke.",
      "color": "#66fcf1"
    },
    {
      "id": "monster-drop",
      "category": "redemption",
      "name": "Monster Drop X-Treme",
      "tagline": "Time the Drop. Hit the Monster Jackpot.",
      "description": "Benchmark Games giant high-striker redemption spectacle. A single rubber ball drops down a clear vertical acrylic chute into a spinning disc packed with point holes, Mystery Value, and Monster Jackpot.",
      "tickets_per_play": "10–1000+ Tickets",
      "difficulty": "Medium",
      "players": "1",
      "manufacturer": "Benchmark Games",
      "tips": [
        "Account for ball drop fall time: gravity drop takes approximately 0.8 seconds from release.",
        "Study the rotational speed of the disc before pressing the drop button."
      ],
      "strategy": "Lead the target: press when the Monster Jackpot slot is positioned at the 9 o'clock angle to ensure the ball arrives as the slot rotates to 12 o'clock.",
      "color": "#ff6ec7"
    },
    {
      "id": "claw-machine-plush",
      "category": "merchandiser",
      "name": "UFO Catcher / Plush Claw Machine",
      "tagline": "The Art of the Precision Grab.",
      "description": "The crown jewel of merchandiser arcades across the globe, from Akihabara game centers to Western entertainment malls. Uses a 2-finger or 3-finger pneumatic claw crane with motorized X-Y gantry.",
      "tickets_per_play": "Direct Prize Win",
      "difficulty": "Hard",
      "players": "1",
      "manufacturer": "Sega / Elaut / Coast to Coast",
      "tips": [
        "Look for cardboard tags, sewn ribbon loops, and limb junctions instead of soft plush centers.",
        "Study the drop chute lip: prizes resting partly on the acrylic chute wall require less lift.",
        "Check gantry swing: release slightly behind the target to allow forward pendulum drift."
      ],
      "strategy": "Tag hooking: position one claw finger directly through the manufacturer's card loop. Even when payout voltage dips, the physical hook delivers the prize.",
      "color": "#ff6ec7"
    },
    {
      "id": "coin-pusher",
      "category": "merchandiser",
      "name": "Coin Pusher Deluxe",
      "tagline": "The Irresistible Cascade of Tokens and Cards.",
      "description": "A staple of modern and retro arcades. Players drop metal tokens or coins down timing chutes onto a motorized sliding pusher tier, nudging piles of coins and collectible cards over the lower prize drop.",
      "tickets_per_play": "Direct Coins / Prize Cards",
      "difficulty": "Easy",
      "players": "1–2",
      "manufacturer": "Andamiro / Harry Levy",
      "tips": [
        "Time coin releases to hit the pusher bed at the exact start of its FORWARD stroke.",
        "Focus on one column; scattering coins randomly disperses your push pressure.",
        "Look for side overhangs where stacks of cards or tokens are already leaning."
      ],
      "strategy": "Bed compaction: drop 3 coins in rapid succession down the same chute to create a solid push wedge that shifts the front line forward.",
      "color": "#ff6ec7"
    },
    {
      "id": "key-master",
      "category": "merchandiser",
      "name": "Key Master / Barber Cut",
      "tagline": "Sub-Millimeter Keyhole Precision.",
      "description": "High-value prize merchandiser by Sega. Players use two directional buttons to steer a motorized key blade horizontally and vertically, aiming to slide through an unlock slot into premium electronics or collectibles.",
      "tickets_per_play": "Direct High-Value Win",
      "difficulty": "Hard",
      "players": "1",
      "manufacturer": "Sega Amusements",
      "tips": [
        "Crouch to eye-level with the key blade to avoid vertical parallax distortion.",
        "Release the vertical button just as the key tip aligns with the lower 1/3 of the keyway."
      ],
      "strategy": "Parallax elimination: view the key blade from both the front glass and the side diagonal glass to verify true 3D alignment before releasing.",
      "color": "#ff6ec7"
    },
    {
      "id": "pinball-classic",
      "category": "pinball",
      "name": "Medieval Madness",
      "tagline": "The Greatest Pinball Machine of All Time.",
      "description": "Designed by Brian Eddy and released by Williams in 1997. Renowned for its exploding drawbridge castle, motorized troll targets, comedic speech by Tina Fey, and the legendary 'Battle for the Kingdom' wizard mode.",
      "tickets_per_play": "High Score Competition",
      "difficulty": "Hard",
      "players": "1–4",
      "manufacturer": "Williams Electronic Games",
      "tips": [
        "Execute the 'Dead Bounce': absorb incoming fast ball momentum without flipping.",
        "Trap the ball on the right flipper to safely line up the Castle Drawbridge shot.",
        "Stack Multiball Madness with Royal Rumble multipliers for 5x jackpot values."
      ],
      "strategy": "Castle assault loop: knock down the drawbridge gate, bash the portcullis, and sink the center shot to destroy castles and advance toward Wizard Mode.",
      "color": "#bf5fff"
    },
    {
      "id": "pinball-modern",
      "category": "pinball",
      "name": "Deadpool Pro Pinball",
      "tagline": "Fourth-Wall Breaking Marvel Mayhem.",
      "description": "Designed by George Gomez for Stern Pinball. Features the iconic Merc with a Mouth with custom comic callouts, Katana sword ramps, 'Lil Deadpool' mini-target, disco multiball loops, and retro 8-bit battle animations.",
      "tickets_per_play": "High Score Competition",
      "difficulty": "Medium",
      "players": "1–4",
      "manufacturer": "Stern Pinball",
      "tips": [
        "Hit the Katana ramp on the left loop to lock balls and feed the upper playfield.",
        "Spell CHIMICHANGA to trigger 3x playfield scoring before entering Sauron or Juggernaut battles."
      ],
      "strategy": "Battle stacking: start a Villain Battle (Sabretooth, Juggernaut) and immediately start Lil' Deadpool Multiball to fight while in multiball safety.",
      "color": "#ff3333"
    },
    {
      "id": "pinball-addams",
      "category": "pinball",
      "name": "The Addams Family Pinball",
      "tagline": "The Best-Selling Pinball Machine in History (20,270 Units).",
      "description": "Designed by Pat Lawlor and released by Midway/Bally in 1992. Stars the voices of Raul Julia and Anjelica Huston. Features 'The Thing' motorized magnetic hand that snatches the ball directly from the playfield.",
      "tickets_per_play": "High Score Competition",
      "difficulty": "Medium",
      "players": "1–4",
      "manufacturer": "Bally / Midway",
      "tips": [
        "Aim for the Swamp kickout to tour the Addams Mansion rooms.",
        "Watch out for 'The Power' magnets under the lower playfield; they randomize ball physics."
      ],
      "strategy": "Tour the Mansion: complete all 12 mansion rooms to trigger the 50-million-point grand wizard jackpot.",
      "color": "#bf5fff"
    },
    {
      "id": "rhythm-ddr",
      "category": "rhythm",
      "name": "Dance Dance Revolution (DDR A3)",
      "tagline": "The Pioneer of Global Arcade Exergaming.",
      "description": "Konami's world-famous dance simulation arcade game. Players stand on a pressure-sensitive dance stage with 4 directional arrows (Up, Down, Left, Right), stepping in sync with flashing arrow cues to electronic music.",
      "tickets_per_play": "Stage Rating & Performance",
      "difficulty": "Hard",
      "players": "1–2",
      "manufacturer": "Konami Amusement",
      "tips": [
        "Keep your weight on the balls of your feet; never flat-foot or jump needlessly.",
        "Use the rear support bar to stabilize your upper body and increase footstep speed.",
        "Read notes from the center of the screen to give your feet time to react."
      ],
      "strategy": "Crossover technique: practice turning your hips when arrow patterns alternate left-down-right to avoid double-stepping on one foot.",
      "color": "#00ff88"
    },
    {
      "id": "rhythm-maimai",
      "category": "rhythm",
      "name": "MaiMai DX Prism",
      "tagline": "Washing Machine Arcade Drumming Phenomenon.",
      "description": "Sega's wildly popular circular rhythm game cabinet resembling a futuristic washing machine. Features a circular touchscreen bordered by eight perimeter physical buttons, surrounded by RGB LEDs and headphone jacks.",
      "tickets_per_play": "Score & Dan Rank Certification",
      "difficulty": "Hard",
      "players": "1–2",
      "manufacturer": "Sega Games",
      "tips": [
        "Wear lightweight cloth arcade gloves to slide smoothly across the glass without friction burn.",
        "Learn the slide star timing: stars linger before tracing curved trajectories across the screen.",
        "Use both thumbs and palms for cluster rings."
      ],
      "strategy": "Center-out hand positioning: keep hands floating around the inner circle perimeter so button strikes and screen swipes blend into fluid gestures.",
      "color": "#00ff88"
    },
    {
      "id": "rhythm-taiko",
      "category": "rhythm",
      "name": "Taiko no Tatsujin (Nijiiro)",
      "tagline": "Traditional Japanese Drumming Action.",
      "description": "Bandai Namco's iconic rhythm game. Players hold wooden drumsticks (Bachi) and beat a simulated Japanese Taiko drum. Strike the face for 'Don' (red notes) and the wooden rim for 'Ka' (blue notes).",
      "tickets_per_play": "Score & Soul Gauge",
      "difficulty": "Medium",
      "players": "1–2",
      "manufacturer": "Bandai Namco Entertainment",
      "tips": [
        "Use wrist snaps rather than full arm swings for fast 16th-note drum rolls.",
        "Alternate hands consistently: Right-Left-Right-Left rather than one-hand dominant mashing."
      ],
      "strategy": "Roll technique: hold bachi loosely and let them rebound off the drum surface for rapid 10+ hit per second drum roll segments.",
      "color": "#ff9900"
    },
    {
      "id": "racing-initial-d",
      "category": "racing",
      "name": "Initial D The Arcade",
      "tagline": "Touge Mountain Drift Warfare.",
      "description": "Sega's flagship drift racing simulator based on Shuichi Shigeno's street racing manga. Features H-pattern 6-speed manual shifter, force-feedback steering wheel, clutch pedal, and card-saved tuned cars.",
      "tickets_per_play": "Time Attack & Versus Glory",
      "difficulty": "Hard",
      "players": "1–4 Linked",
      "manufacturer": "Sega Amusements",
      "tips": [
        "Master the Feint Drift: steer slightly away from the corner, lift throttle, then whip steering inward.",
        "Downshift before corner entry to lock into high-torque powerbands on exit."
      ],
      "strategy": "Weight transfer: use rapid throttle release right before turn-in to shift vehicle mass to the front tires, initiating a smooth hairpin slide.",
      "color": "#ff9900"
    },
    {
      "id": "racing-mario-kart",
      "category": "racing",
      "name": "Mario Kart Arcade GP DX",
      "tagline": "Family Friendly Multiplayer Racing.",
      "description": "Co-developed by Nintendo and Bandai Namco. Features Mario Kart characters, Namco guest racers (Pac-Man, Don-chan), steering wheel with item-trigger button, face-capturing Nam Cam avatar lens, and glider flights.",
      "tickets_per_play": "Versus Grand Prix Cups",
      "difficulty": "Easy",
      "players": "1–4 Linked",
      "manufacturer": "Bandai Namco / Nintendo",
      "tips": [
        "Hop and hold steering to trigger Mini-Turbo sparks around long bends.",
        "Save defensive green shells or bananas behind your kart by holding the item button."
      ],
      "strategy": "Rocket start: hit the gas pedal exactly on the transition from '2' to '1' during the starting countdown for a massive initial boost.",
      "color": "#ff9900"
    },
    {
      "id": "shooter-time-crisis",
      "category": "shooter",
      "name": "Time Crisis 5",
      "tagline": "Dual-Pedal Tactical Cover Gun Combat.",
      "description": "Bandai Namco's premier light gun arcade franchise. Revolutionized the cover system by introducing two foot pedals, allowing players to flank enemies from left and right angles, reload, and switch heavy weapons.",
      "tickets_per_play": "Story Stage Progression",
      "difficulty": "Medium",
      "players": "1–2",
      "manufacturer": "Bandai Namco Entertainment",
      "tips": [
        "Pedal coordination: step on pedals to emerge and shoot; release to duck behind cover and reload.",
        "Use pedal switches to flank boss armor shields when direct shots ricochet."
      ],
      "strategy": "Ammo conservation: switch to shotgun or grenade launcher exclusively on armored vehicles and clustered crowds; use standard pistol for rapid headshots.",
      "color": "#ff3333"
    },
    {
      "id": "shooter-house-dead",
      "category": "shooter",
      "name": "House of the Dead: Scarlet Dawn",
      "tagline": "Horror Theater Gun Simulation.",
      "description": "Sega's horror rail shooter set inside an enclosed theater cabinet. Features 5.1 channel vibration bass surround, blast-air sensory nozzles, force-feedback motion sub-machine guns, and Unreal Engine 4 zombie hordes.",
      "tickets_per_play": "Story Survival Rank",
      "difficulty": "Hard",
      "players": "1–2",
      "manufacturer": "Sega Amusements",
      "tips": [
        "Always aim for zombie headshots and weak points highlighted during boss warning screens.",
        "Rescue civilian hostages along paths for health kit drops and bonus weapon unlocks."
      ],
      "strategy": "Cancel bar management: during boss attack charges, pour combined sustained fire into the glowing yellow cancel gauge to interrupt deadly attacks.",
      "color": "#ff3333"
    }
  ]
}
;
