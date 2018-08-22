# Trust

## Usage
After cloning install all node dependencies
```bash
npm i
```

Then launch the main task to open budo livereload server  
```bash
npm start
```

# Hawks v Doves

Notes from http://www.cs.rug.nl/~michael/teaching/gametheorysheets.pdf.

- Suppose two rivals of the same species meet at the location of some resource with
value G.
- Suppose there are two “pure” strategies:

1. Hawk: you always escalate the conflict until either the other withdraws, or you
are badly hurt.
2. Dove: you posture until the other withdraws, but you withdraw if the other
escalates or seems too strong.

- If two hawks meet, one wins G but the other loses cost C, with G < C.
- If two doves meet, one withdraws and loses nothing, and the other wins G.
- If a hawk meets a dove, the dove loses nothing and the hawk wins G.


## The System

### Resources

Resources are static, and when generated are randomly positioned in the world. Both Hawks and Doves are attracted towards resources.

If either meet a resource with no competition (for X ms), they take it.

If either meet a resource, and another character (within X ms), they apply their strategy to decide:

- Who gets the resource and gains G
- Who loses cost C (if anyone)

## Hawks

Hawks are aggressive, and don't mind fighting for resources to gain G, even though they may lose and forfeit cost C, where G < C.

*Note: the higher C, the more dangerous the animal is.*

## Doves

Doves are passive, and don't like to fight. They would rather forfeit resources to stronger opposition, and not risk losing cost C to gain resource G. They'll happily take G if there is no cost C to lose, which only happens if they face no opposition or encounter another Dove.

## Payoff Matrix

This describes the average payoff. In a simulation, we'd play out the battle, using the flip of a coin to decide the outcome of H v H and D v D.

|            | if it meets H | if it meets D |
|------------|---------------|---------------|
| H receives | (G - C) / 2   | G             |
| D receives | 0             | G / 2         |

## Optimal Behaviour

- If Doves dominate the population, it pays to be a Hawk. Hawks will almost always face no strong opposition and win G, whilst Doves will almost always win G / 2 when faced with opposition.

- If Hawkes dominate, it pays to be a Dove. Remember than G < C, so (G - C) / 2 < 0.
