import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Milestone } from 'lucide-react';

interface MilestoneData {
  current: number;
  next: number;
  nextDate: Date;
  unit: string;
  options: number[];
  selectedMilestone: number;
}


function calculateMilestones(birthDate: Date, selectedMilestones: Record<string, number>): MilestoneData[] {
  const now = new Date();
  const birth = new Date(birthDate);

  // Calculate elapsed time from birthdate (exact differences based on the birth moment)
  const diffMs = now.getTime() - birth.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Correct months and years calculation
  const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  let diffYears = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
    diffYears--;
  }

  function generateMilestoneOptions(current: number, unit: string): number[] {
    switch (unit) {
      case 'années':
        if (current < 20) {
          // For kids, just show next integers
          return Array.from({ length: 5 }, (_, i) => current + i + 1);
        }
        if (current < 50) return [20, 30, 40, 50, 100];
        if (current < 100) return [50, 100, 150, 200, 250];
        return [100, 150, 200, 250, 300];

      case 'mois':
        // Base 10 multiples for months
        if (current < 10) return [10, 20, 30, 40, 50];
        if (current < 50) return [50, 100, 200, 300, 500];
        if (current < 100) return [100, 200, 300, 500, 1000];
        return [500, 1000, 1500, 2000, 2500];

      case 'minutes':
      case 'secondes':
        // Ensure two-digit precision for large numbers
        const digits = current.toString().length;
        const base = Math.pow(10, digits - 1);

        // First milestone
        const firstMilestone = Math.ceil(current / base) * base;

        // Generate subsequent milestones with consistent progression
        const milestones = [
          firstMilestone,
          firstMilestone + base,
          firstMilestone + base * 2,
          firstMilestone + base * 3,
          firstMilestone + base * 4
        ];

        // Filter out milestones that are less than or equal to current value
        return milestones.filter(milestone => milestone > current).slice(0, 5);

      default:
        return [];
    }
  }

  function calculateNextDate(current: number, target: number, unit: string, birth: Date): Date {
    const nextDate = new Date(birth);

    switch (unit) {
      case 'années':
        nextDate.setFullYear(birth.getFullYear() + target);
        break;
      case 'mois':
        nextDate.setMonth(birth.getMonth() + target);
        break;
      case 'minutes':
        nextDate.setMinutes(birth.getMinutes() + target);
        break;
      case 'secondes':
        nextDate.setSeconds(birth.getSeconds() + target);
        break;
    }

    return nextDate;
  }


  // Compute milestones
  const milestones: MilestoneData[] = [
    {
      current: diffYears,
      next: selectedMilestones.years || generateMilestoneOptions(diffYears, 'années')[0],
      nextDate: calculateNextDate(diffYears, selectedMilestones.years || generateMilestoneOptions(diffYears, 'années')[0], 'années', birth),
      unit: 'années',
      options: generateMilestoneOptions(diffYears, 'années'),
      selectedMilestone: selectedMilestones.years || generateMilestoneOptions(diffYears, 'années')[0]
    },
    {
      current: diffMonths,
      next: selectedMilestones.months || generateMilestoneOptions(diffMonths, 'mois')[0],
      nextDate: calculateNextDate(diffMonths, selectedMilestones.months || generateMilestoneOptions(diffMonths, 'mois')[0], 'mois', birth),
      unit: 'mois',
      options: generateMilestoneOptions(diffMonths, 'mois'),
      selectedMilestone: selectedMilestones.months || generateMilestoneOptions(diffMonths, 'mois')[0]
    },
    {
      current: diffMinutes,
      next: selectedMilestones.minutes || generateMilestoneOptions(diffMinutes, 'minutes')[0],
      nextDate: calculateNextDate(diffMinutes, selectedMilestones.minutes || generateMilestoneOptions(diffMinutes, 'minutes')[0], 'minutes', birth),
      unit: 'minutes',
      options: generateMilestoneOptions(diffMinutes, 'minutes'),
      selectedMilestone: selectedMilestones.minutes || generateMilestoneOptions(diffMinutes, 'minutes')[0]
    },
    {
      current: diffSeconds,
      next: selectedMilestones.seconds || generateMilestoneOptions(diffSeconds, 'secondes')[0],
      nextDate: calculateNextDate(diffSeconds, selectedMilestones.seconds || generateMilestoneOptions(diffSeconds, 'secondes')[0], 'secondes', birth),
      unit: 'secondes',
      options: generateMilestoneOptions(diffSeconds, 'secondes'),
      selectedMilestone: selectedMilestones.seconds || generateMilestoneOptions(diffSeconds, 'secondes')[0]
    }
  ];

  return milestones;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function App() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [milestones, setMilestones] = useState<MilestoneData[]>([]);
  const [selectedMilestones, setSelectedMilestones] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!birthDate) return;

    setMilestones(calculateMilestones(new Date(birthDate), selectedMilestones));

    const timer = setInterval(() => {
      setMilestones(calculateMilestones(new Date(birthDate), selectedMilestones));
    }, 5000);

    return () => clearInterval(timer);
  }, [birthDate, selectedMilestones]);

  const handleMilestoneChange = (unit: string, value: string) => {
    setSelectedMilestones(prev => ({
      ...prev,
      [unit]: parseInt(value, 10)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <div className="flex items-center gap-2 mb-6">
          <Milestone className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Calculateur d'anniversaire</h1>
        </div>

        <div className="mb-8">
          <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-2">
            Quelle est votre date de naissance ?
          </label>
          <input
            type="date"
            id="birthdate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {milestones.length > 0 && (
          <div className="space-y-6">
            {milestones.map((milestone) => (
              <div
                key={milestone.unit}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-gray-800 capitalize">
                    {milestone.unit}
                  </h2>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    Actuel : <span className="font-bold text-indigo-600">{milestone.current.toLocaleString('fr-FR')}</span> {milestone.unit}
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="text-gray-600">Prochain jalon :</label>
                    <select
                      value={milestone.selectedMilestone}
                      onChange={(e) => handleMilestoneChange(milestone.unit, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {milestone.options.map((option) => (
                        <option key={option} value={option}>
                          {option.toLocaleString('fr-FR')} {milestone.unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-gray-600">
                    Se produira le : <span className="font-bold text-purple-600">{formatDate(milestone.nextDate)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;