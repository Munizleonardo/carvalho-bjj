export type Athlete = {
  id: string;
  nome: string;
  idade: number;
  peso: number | null;
  faixa: string;
  categoria: string | null;
  status: string;
};

export type MatchSide = "top" | "bottom";

export type BracketSlot = {
  athlete: Athlete | null;
  label: string;
};

export type BracketMatch = {
  id: string;
  number: number;
  roundIndex: number;
  top: BracketSlot;
  bottom: BracketSlot;
  winnerSide: MatchSide | null;
  resolvedWinner: Athlete | null;
};

export type BracketRound = {
  title: string;
  matches: BracketMatch[];
};

export type StoredBracket = {
  id: string;
  name: string;
  athleteIds: string[];
  description: string;
  slotAthleteIds: Array<string | null>;
  winnerSelections: Array<Array<MatchSide | null>>;
};

export type Bracket = StoredBracket & {
  rounds: BracketRound[];
};

type RoundEntrant = {
  athlete: Athlete | null;
  label: string;
};

function getRoundTitle(matchCount: number) {
  if (matchCount <= 1) return "Final";
  if (matchCount === 2) return "Semifinal";
  if (matchCount === 4) return "Quartas";
  if (matchCount === 8) return "Oitavas";
  return `Round ${matchCount}`;
}

export function buildBracketName(athletes: Athlete[]) {
  const categories = Array.from(new Set(athletes.map((athlete) => athlete.categoria ?? "Sem categoria")));
  const belts = Array.from(new Set(athletes.map((athlete) => athlete.faixa)));
  const categoryLabel = categories.length === 1 ? categories[0] : "Multicategoria";
  const beltLabel = belts.length === 1 ? belts[0] : "Faixa mista";
  return `${categoryLabel} - ${beltLabel}`;
}

export function createEmptyWinnerSelections(athleteCount: number) {
  const rounds: Array<Array<MatchSide | null>> = [];
  let entrantsCount = athleteCount;

  while (entrantsCount > 1) {
    const matchCount = Math.floor(entrantsCount / 2);
    rounds.push(Array.from({ length: matchCount }, () => null));
    entrantsCount = matchCount + (entrantsCount % 2);
  }

  return rounds;
}

function resolveWinner(
  topAthlete: Athlete | null,
  bottomAthlete: Athlete | null,
  winnerSide: MatchSide | null
) {
  if (winnerSide === "top" && topAthlete) return { winnerSide: "top" as const, resolvedWinner: topAthlete };
  if (winnerSide === "bottom" && bottomAthlete) return { winnerSide: "bottom" as const, resolvedWinner: bottomAthlete };
  if (topAthlete && !bottomAthlete) return { winnerSide: "top" as const, resolvedWinner: topAthlete };
  if (!topAthlete && bottomAthlete) return { winnerSide: "bottom" as const, resolvedWinner: bottomAthlete };
  return { winnerSide: null, resolvedWinner: null };
}

export function buildBracketRounds(
  slotAthleteIds: Array<string | null>,
  athletesById: Map<string, Athlete>,
  winnerSelections: Array<Array<MatchSide | null>>
) {
  if (slotAthleteIds.length === 0) return [];

  const rounds: BracketRound[] = [];
  let fightNumber = 1;

  let currentEntrants: RoundEntrant[] = slotAthleteIds.map((athleteId, index) => {
    const athlete = athleteId ? athletesById.get(athleteId) ?? null : null;
    const isDirectAdvanceSlot = slotAthleteIds.length % 2 === 1 && index === slotAthleteIds.length - 1;

    return {
      athlete,
      label: athlete?.nome ?? (isDirectAdvanceSlot ? "Classificado direto" : "Slot vazio"),
    };
  });

  let roundIndex = 0;

  while (currentEntrants.length > 1) {
    const matches: BracketMatch[] = [];
    const nextEntrants: RoundEntrant[] = [];
    const hasCarry = currentEntrants.length % 2 === 1;
    const matchCount = Math.floor(currentEntrants.length / 2);

    for (let matchIndex = 0; matchIndex < matchCount; matchIndex += 1) {
      const topEntry = currentEntrants[matchIndex * 2];
      const bottomEntry = currentEntrants[matchIndex * 2 + 1];
      const resolved = resolveWinner(
        topEntry.athlete,
        bottomEntry.athlete,
        winnerSelections[roundIndex]?.[matchIndex] ?? null
      );

      const match: BracketMatch = {
        id: crypto.randomUUID(),
        number: fightNumber++,
        roundIndex,
        top: topEntry,
        bottom: bottomEntry,
        winnerSide: resolved.winnerSide,
        resolvedWinner: resolved.resolvedWinner,
      };

      matches.push(match);
      nextEntrants.push({
        athlete: match.resolvedWinner,
        label: match.resolvedWinner?.nome ?? `Vencedor L${match.number}`,
      });
    }

    if (hasCarry) {
      nextEntrants.push(currentEntrants[currentEntrants.length - 1]);
    }

    rounds.push({ title: getRoundTitle(matches.length), matches });
    currentEntrants = nextEntrants;
    roundIndex += 1;
  }

  return rounds;
}

export function hydrateBracket(storedBracket: StoredBracket, athletesById: Map<string, Athlete>): Bracket {
  return {
    ...storedBracket,
    rounds: buildBracketRounds(storedBracket.slotAthleteIds, athletesById, storedBracket.winnerSelections),
  };
}

export function hydrateBrackets(storedBrackets: StoredBracket[], athletesById: Map<string, Athlete>) {
  return storedBrackets.map((storedBracket) => hydrateBracket(storedBracket, athletesById));
}

export function serializeBrackets(brackets: Bracket[]): StoredBracket[] {
  return brackets.map((bracket) => ({
    id: bracket.id,
    name: bracket.name,
    athleteIds: bracket.athleteIds,
    description: bracket.description,
    slotAthleteIds: bracket.slotAthleteIds,
    winnerSelections: bracket.winnerSelections,
  }));
}

export function normalizeStoredBracket(value: unknown): StoredBracket | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<StoredBracket>;
  if (typeof candidate.id !== "string" || typeof candidate.name !== "string" || typeof candidate.description !== "string") {
    return null;
  }

  if (!Array.isArray(candidate.athleteIds) || !Array.isArray(candidate.slotAthleteIds) || !Array.isArray(candidate.winnerSelections)) {
    return null;
  }

  const athleteIds = candidate.athleteIds.every((item) => typeof item === "string");
  const slotAthleteIds = candidate.slotAthleteIds.every((item) => item === null || typeof item === "string");
  const winnerSelections = candidate.winnerSelections.every(
    (round) =>
      Array.isArray(round) &&
      round.every((item) => item === null || item === "top" || item === "bottom")
  );

  if (!athleteIds || !slotAthleteIds || !winnerSelections) return null;

  return {
    id: candidate.id,
    name: candidate.name,
    athleteIds: candidate.athleteIds,
    description: candidate.description,
    slotAthleteIds: candidate.slotAthleteIds,
    winnerSelections: candidate.winnerSelections as Array<Array<MatchSide | null>>,
  };
}
