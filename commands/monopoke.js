let t = JSON.parse(FS.readFileSync('data/types.json'));

let canMakeTour = function (room, user) {
    // I'm gonna use this a lot so why not make a function for it
    if (room != '1v1' && room != '1v1typechallenge') return false;
    if (!user.can(room, "%")) return false;
    if (room.tournament) {
        room.send("A tournament is already going on.");
        return false;
    }
    return true;
}

let chooseMonopoke = function (gen) {
    let mons = [];
    for (let i in PokeDex) {
        if (PokeDex[i].baseSpecies) continue;
        if (gen === "gen7" && PokeDex[i].num > 809) continue;
        if (gen === "gen8" && fdata[i].isNonstandard === "Past") continue;
        mons.push(i);
    }
    let mon = Math.floor(Math.random() * mons.length);
    mon = mons[mon];
    mon = PokeDex[mon];
    if (mon.baseSpecies) mon = chooseMonopoke(gen);
    return mon.name;
}

module.exports = {
    monopoke: {
        '': function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            let official = args[0] === 'o';
            if (official) args = [];
            if (!args[0]) args[0] = chooseMonopoke(false);
            let dex = PokeDex[toId(args[0])];
            let fdt = fdata[toId(args[0])];
            if (!dex) return room.send(`${args[0]} is not a Pokémon`);
            if (fdt.isNonstandard === "Past") return Commands['monopoke']['gen7'](room, user, args, official ? "official" : false);
            else return Commands['monopoke']['gen8'](room, user, args, official ? "official" : false);
        },
        gen8: function (room, user, args, x) {
            if (!canMakeTour(room, user)) return;
            if (!args[0]) args[0] = chooseMonopoke('gen8');
            let dex = PokeDex[toId(args[0])];
            let fdt = fdata[toId(args[0])];
            if (!dex) return room.send(`${args[0]} is not a Pokémon`);
            if (fdt.isNonstandard === "Past") return room.send(`${dex.name} is only available in past gens`);
            let mon = dex.name;
            let ruleset = `/tour rules !Team Preview, -All Pokemon, +${mon}`;
            Commands['1v1']['gen8'](room, user, args);
            room.startTour("monopoke");
            room.send(ruleset);
            room.send("/tour name [Gen 8] Monopoke " + mon);
            room.send(`/wall Monopoke ${mon}! Use only ${mon}`);
            if (x === "official") room.send('.official');
        },
        gen7: function (room, user, args, x) {
            if (!canMakeTour(room, user)) return;
            if (!args[0]) args[0] = chooseMonopoke('gen7');
            let dex = PokeDex[toId(args[0])];
            let fdt = fdata[toId(args[0])];
            if (!dex) return room.send(`${args[0]} is not a Pokémon`);
            if (dex.num > 809) return room.send(`${dex.name} is not available in gen 7.`);
            let mon = dex.name;
            let ruleset = `/tour rules !Team Preview, -All Pokemon, +${mon}`;
            Commands['1v1']['gen7'](room, user, args);
            room.startTour("monopoke");
            room.send(ruleset);
            room.send("/tour name [Gen 7] Monopoke " + mon);
            room.send(`/wall Monopoke ${mon}! Use only ${mon}`);
            if (x === "official") room.send('.official');
        }
    },
    camonopoke: {
        '': function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            if (!args[0]) args[0] = chooseMonopoke(false);
            let dex = PokeDex[toId(args[0])];
            let fdt = fdata[toId(args[0])];
            if (!dex) return room.send(`${args[0]} is not a Pokémon`);
            if (fdt.isNonstandard === "Past") return Commands['camonopoke']['gen7'](room, user, args);
            else return Commands['camonopoke']['gen8'](room, user, args);
        },
        gen8: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            if (!args[0]) args[0] = chooseMonopoke('gen8');
            let dex = PokeDex[toId(args[0])];
            let fdt = fdata[toId(args[0])];
            if (!dex) return room.send(`${args[0]} is not a Pokémon`);
            if (fdt.isNonstandard === "Past") return room.send(`${dex.name} is only available in past gens`);
            let mon = dex.name;
            let ruleset = `/tour rules !Team Preview, -All Pokemon, +${mon}, [Gen 8] Camomons`;
            Commands['1v1']['gen8'](room, user, args);
            room.startTour("monopoke");
            room.send(ruleset);
            room.send("/tour name [Gen 8] Camonopoke " + mon);
            room.send(`/wall Camomons Monopoke ${mon}! Use only ${mon}`);
        },
        gen7: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            if (!args[0]) args[0] = chooseMonopoke('gen7');
            let dex = PokeDex[toId(args[0])];
            let fdt = fdata[toId(args[0])];
            if (!dex) return room.send(`${args[0]} is not a Pokémon`);
            if (dex.num > 809) return room.send(`${dex.name} is not available in gen 7.`);
            let mon = dex.name;
            let ruleset = `/tour rules !Team Preview, -All Pokemon, +${mon}, [Gen 8] Camomons`;
            Commands['1v1']['gen7'](room, user, args);
            room.startTour("monopoke");
            room.send(ruleset);
            room.send("/tour name [Gen 7] Camonopoke " + mon);
            room.send(`/wall Camomons Monopoke ${mon}! Use only ${mon}`);
        }
    }
}