// Work types and their heat-risk multipliers used by the heat risk engine.
// Higher weight = the same weather is more dangerous for that work.

export type WorkType = {
  id: string;
  label: string;
  icon: string; // Ionicons name
  // Risk multiplier applied to the weather/exposure score (1.0 = neutral baseline).
  weight: number;
  // One-line description of why this work is heat-exposed (feeds agent evidence).
  exposure: string;
};

export const workTypes: WorkType[] = [
  {
    id: 'construction',
    label: 'Construction',
    icon: 'construct',
    weight: 1.18, // very high
    exposure: 'Heavy manual labor in direct sun, reflected heat off concrete and steel',
  },
  {
    id: 'delivery',
    label: 'Delivery',
    icon: 'bicycle',
    weight: 1.10, // high
    exposure: 'Repeated sun exposure, hot vehicle cabins and route fatigue between stops',
  },
  {
    id: 'landscaping',
    label: 'Landscaping',
    icon: 'leaf',
    weight: 1.16, // very high
    exposure: 'Continuous unshaded exertion on open ground with no natural cover',
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'shield',
    weight: 1.06, // medium-high
    exposure: 'Long static standing posts, dark uniforms absorbing heat',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: 'build',
    weight: 1.10, // high
    exposure: 'Hot equipment, reflective roofs and confined spaces with poor airflow',
  },
  {
    id: 'events',
    label: 'Event Setup',
    icon: 'flag',
    weight: 1.10, // high
    exposure: 'Time-pressured lifting and rigging on hot open venues',
  },
];

export function getWorkType(id: string | null | undefined): WorkType {
  return workTypes.find((w) => w.id === id) ?? workTypes[0];
}
