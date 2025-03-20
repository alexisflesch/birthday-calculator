import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Milestone } from 'lucide-react';

interface MilestoneData {
  current: number;
  next: number;
  nextDate: Date;
  unit: string;
  frenchUnit: string;
  options: number[];
  selectedMilestone: number;
}

const frenchUnitFullNames: Record<string, string> = {
  'ans': 'Années',
  'mois': 'Mois',
  'jours': 'Jours',
  'minutes': 'Minutes',
  'secondes': 'Secondes'
};

function calculateMilestones(birthDate: Date, selectedMilestones: Record<string, number>): MilestoneData[] {
  const now = new Date();
  const birth = new Date(birthDate);

  // Calculate elapsed time from birthdate
  const diffMs = now.getTime() - birth.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  let diffYears = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
    diffYears--;
  }

  function generateMilestoneOptions(current: number, unit: string): number[] {
    switch (unit) {
      case 'years':
        if (current < 20) {
          const milestones = Array.from({ length: 5 }, (_, i) => current + i + 1);
          const nextRoundNumber = Math.ceil((current + 1) / Math.pow(10, current.toString().length - 1)) * Math.pow(10, current.toString().length - 1);
          if (!milestones.includes(nextRoundNumber)) milestones.push(nextRoundNumber);
          return milestones;
        }
        const yearsDigits = current.toString().length;
        const yearsBase = Math.pow(10, yearsDigits - 1);
        const yearsFirstMilestone = Math.ceil((current + 1) / yearsBase) * yearsBase;
        const milestones = [
          yearsFirstMilestone,
          yearsFirstMilestone + yearsBase,
          yearsFirstMilestone + yearsBase * 2,
          yearsFirstMilestone + yearsBase * 3,
          yearsFirstMilestone + yearsBase * 4,
          yearsFirstMilestone + yearsBase * 5
        ];
        const nextRoundNumber = Math.ceil((current + 1) / Math.pow(10, current.toString().length - 1)) * Math.pow(10, current.toString().length - 1);
        if (!milestones.includes(nextRoundNumber)) milestones.push(nextRoundNumber);
        return milestones;

      case 'months':
        let milestonesMonths;
        if (current < 10) milestonesMonths = [10, 20, 30, 40, 50].filter(m => m > current);
        else if (current < 100) milestonesMonths = Array.from({ length: 5 }, (_, i) => Math.ceil((current + 1) / 10) * 10 + i * 10);
        else milestonesMonths = Array.from({ length: 5 }, (_, i) => Math.ceil((current + 1) / 100) * 100 + i * 100);

        const nextRoundNumberMonths = Math.ceil(current / Math.pow(10, current.toString().length - 1)) * Math.pow(10, current.toString().length - 1);
        if (!milestonesMonths.includes(nextRoundNumberMonths)) milestonesMonths.push(nextRoundNumberMonths);
        return milestonesMonths;

      case 'days':
        const daysDigits = current.toString().length;
        const daysBase = Math.min(Math.pow(10, daysDigits - 1), 1000);
        const daysFirstMilestone = Math.ceil((current + 1) / daysBase) * daysBase;
        const milestonesDays = [
          daysFirstMilestone,
          daysFirstMilestone + daysBase,
          daysFirstMilestone + daysBase * 2,
          daysFirstMilestone + daysBase * 3,
          daysFirstMilestone + daysBase * 4,
          daysFirstMilestone + daysBase * 5
        ];
        const nextRoundNumberDays = Math.ceil((current + 1) / Math.pow(10, current.toString().length - 1)) * Math.pow(10, current.toString().length - 1);
        if (!milestonesDays.includes(nextRoundNumberDays)) milestonesDays.push(nextRoundNumberDays);
        return milestonesDays;

      case 'minutes':
      case 'seconds':
        const digits = current.toString().length;
        const base = Math.pow(10, digits - 2);  // Two significant digits
        const firstMilestone = Math.ceil((current + 1) / base) * base;
        const milestonesTime = [
          firstMilestone,
          firstMilestone + base,
          firstMilestone + base * 2,
          firstMilestone + base * 3,
          firstMilestone + base * 4,
          firstMilestone + base * 5
        ];
        const nextRoundNumberTime = Math.ceil(current / Math.pow(10, current.toString().length - 1)) * Math.pow(10, current.toString().length - 1);
        if (!milestonesTime.includes(nextRoundNumberTime)) milestonesTime.push(nextRoundNumberTime);
        return milestonesTime;

      default:
        return [];
    }
  }

  function calculateNextDate(current: number, target: number, unit: string, birth: Date): Date {
    const nextDate = new Date(birth);
    switch (unit) {
      case 'years':
        nextDate.setFullYear(birth.getFullYear() + target);
        break;
      case 'months':
        nextDate.setMonth(birth.getMonth() + target);
        break;
      case 'days':
        nextDate.setDate(birth.getDate() + target);
        break;
      case 'minutes':
        nextDate.setMinutes(birth.getMinutes() + target);
        break;
      case 'seconds':
        nextDate.setSeconds(birth.getSeconds() + target);
        break;
    }
    return nextDate;
  }

  // Compute milestones
  const milestones: MilestoneData[] = [
    {
      current: diffYears,
      next: selectedMilestones.years || generateMilestoneOptions(diffYears, 'years')[0],
      nextDate: calculateNextDate(diffYears, selectedMilestones.years || generateMilestoneOptions(diffYears, 'years')[0], 'years', birth),
      unit: 'years',
      frenchUnit: 'ans',
      options: generateMilestoneOptions(diffYears, 'years'),
      selectedMilestone: selectedMilestones.years || generateMilestoneOptions(diffYears, 'years')[0]
    },
    {
      current: diffMonths,
      next: selectedMilestones.months || generateMilestoneOptions(diffMonths, 'months')[0],
      nextDate: calculateNextDate(diffMonths, selectedMilestones.months || generateMilestoneOptions(diffMonths, 'months')[0], 'months', birth),
      unit: 'months',
      frenchUnit: 'mois',
      options: generateMilestoneOptions(diffMonths, 'months'),
      selectedMilestone: selectedMilestones.months || generateMilestoneOptions(diffMonths, 'months')[0]
    },
    {
      current: diffDays,
      next: selectedMilestones.days || generateMilestoneOptions(diffDays, 'days')[0],
      nextDate: calculateNextDate(diffDays, selectedMilestones.days || generateMilestoneOptions(diffDays, 'days')[0], 'days', birth),
      unit: 'days',
      frenchUnit: 'jours',
      options: generateMilestoneOptions(diffDays, 'days'),
      selectedMilestone: selectedMilestones.days || generateMilestoneOptions(diffDays, 'days')[0]
    },
    {
      current: diffMinutes,
      next: selectedMilestones.minutes || generateMilestoneOptions(diffMinutes, 'minutes')[0],
      nextDate: calculateNextDate(diffMinutes, selectedMilestones.minutes || generateMilestoneOptions(diffMinutes, 'minutes')[0], 'minutes', birth),
      unit: 'minutes',
      frenchUnit: 'minutes',
      options: generateMilestoneOptions(diffMinutes, 'minutes'),
      selectedMilestone: selectedMilestones.minutes || generateMilestoneOptions(diffMinutes, 'minutes')[0]
    },
    {
      current: diffSeconds,
      next: selectedMilestones.seconds || generateMilestoneOptions(diffSeconds, 'seconds')[0],
      nextDate: calculateNextDate(diffSeconds, selectedMilestones.seconds || generateMilestoneOptions(diffSeconds, 'seconds')[0], 'seconds', birth),
      unit: 'seconds',
      frenchUnit: 'secondes',
      options: generateMilestoneOptions(diffSeconds, 'seconds'),
      selectedMilestone: selectedMilestones.seconds || generateMilestoneOptions(diffSeconds, 'seconds')[0]
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

  // Sort milestones by next date (chronological order)
  const sortedMilestones = [...milestones].sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <div className="flex items-center gap-2 mb-6">
          <Milestone className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Vos anniversaires à venir</h1>
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

        {sortedMilestones.length > 0 && (
          <div className="space-y-6">
            {sortedMilestones.map((milestone) => (
              <div
                key={milestone.unit}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-gray-800 capitalize">
                    {frenchUnitFullNames[milestone.frenchUnit]}
                  </h2>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    Actuel : <span className="font-bold text-indigo-600">{milestone.current.toLocaleString('fr-FR')}</span> {milestone.frenchUnit}
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
                          {option.toLocaleString('fr-FR')} {milestone.frenchUnit}
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