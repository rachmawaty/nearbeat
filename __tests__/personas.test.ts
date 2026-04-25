import { personas, mayaContext, carlosContext, priyaContext } from "@/data/personas";

describe("personas", () => {
  it("has exactly 3 personas", () => {
    expect(Object.keys(personas)).toHaveLength(3);
    expect(Object.keys(personas)).toEqual(["maya", "carlos", "priya"]);
  });

  describe("maya", () => {
    it("has correct persona fields", () => {
      expect(mayaContext.persona.name).toBe("Maya");
      expect(mayaContext.persona.occupation).toBe("UX Designer");
    });

    it("has merchants_nearby populated", () => {
      expect(mayaContext.merchants_nearby.length).toBeGreaterThan(0);
    });

    it("has rain weather", () => {
      expect(mayaContext.environment.weather_code).toBe("rain");
    });

    it("has a morning_commute time label", () => {
      expect(mayaContext.temporal.time_of_day_label).toBe("morning_commute");
    });

    it("has upcoming waypoints", () => {
      expect(mayaContext.route.upcoming_waypoints.length).toBeGreaterThan(0);
    });

    it("schedule has gym event on Tuesday", () => {
      const gym = mayaContext.schedule.today.find((e) =>
        e.event.toLowerCase().includes("gym")
      );
      expect(gym).toBeDefined();
    });
  });

  describe("carlos", () => {
    it("has correct persona fields", () => {
      expect(carlosContext.persona.name).toBe("Carlos");
    });

    it("has lunch time label", () => {
      expect(carlosContext.temporal.time_of_day_label).toBe("lunch");
    });

    it("has maru-sushi in merchants_nearby", () => {
      const sushi = carlosContext.merchants_nearby.find(
        (m) => m.id === "maru-sushi"
      );
      expect(sushi).toBeDefined();
    });

    it("has high avg_transaction", () => {
      expect(carlosContext.spend_history.avg_transaction).toBe("high");
    });
  });

  describe("priya", () => {
    it("has correct persona fields", () => {
      expect(priyaContext.persona.name).toBe("Priya");
    });

    it("has morning time label", () => {
      expect(priyaContext.temporal.time_of_day_label).toBe("morning");
    });

    it("has green-market in merchants_nearby", () => {
      const gm = priyaContext.merchants_nearby.find(
        (m) => m.id === "green-market"
      );
      expect(gm).toBeDefined();
    });
  });
});
