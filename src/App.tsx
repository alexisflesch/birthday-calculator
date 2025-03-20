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
  
  // Calculate differences in various units
  const diffMs = now.getTime() - birth.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30.44);
  const diffYears = Math.floor(diffDays / 365.25);

  // Generate milestone options for years based on current age
  const generateYearOptions = (current: number): number[] => {
    if (current < 1) {
      return [1];
    } else if (current < 5) {
      return Array.from({ length: 5 }, (_, i) => current + i + 1);
    } else if (current < 18) {
      return Array.from({ length: 3 }, (_, i) => current + i + 1);
    }
    return Array.from({ length: 10 }, (_, i) => current + i + 1);
  };

  // Generate milestone options for months based on age
  const generateMonthOptions = (current: number): number[] => {
    if (current < 12) {
      // For babies, show next few months
      return Array.from({ length: 5 }, (_, i) => current + i + 1);
    } else if (current < 100) {
      // For young children, show path to 100 months
      const nextRound = Math.ceil(current / 10) * 10;
      return Array.from({ length: 5 }, (_, i) => nextRound + i * 10);
    } else if (current < 500) {
      // For older children, show path to 500
      const nextRound = Math.ceil(current / 50) * 50;
      return Array.from({ length: 5 }, (_, i) => nextRound + i * 50);
    }
    // For adults, show 500 increments
    const base = Math.floor(current / 500) * 500;
    return Array.from({ length: 5 }, (_, i) => base + (i + 1) * 500);
  };

  // Generate milestone options for minutes and seconds based on current value
  const generateTimeOptions = (current: number): number[] => {
    const digits = current.toString().length;
    let base: number;
    
    if (digits <= 2) {
      base = 1;
    } else if (digits <= 4) {
      base = 10;
    } else {
      base = Math.pow(10, digits - 2);
    }

    return Array.from({ length: 5 }, (_, i) => {
      let milestone = Math.ceil(current / base) * base + (i * base);
      while (milestone.toString().replace(/0+$/, '').length > 2) {
        milestone = Math.ceil(milestone / (base * 10)) * (base * 10);
      }
      return milestone;
    });
  };

  const calculateNextDate = (current: number, target: number, unitMs: number): Date => {
    const unitsToAdd = target - current;
    return new Date(now.getTime() + unitsToAdd * unitMs);
  };

  // Calculate milestones for each unit
  const milestones: MilestoneData[] = [
    {
      current: diffYears,
      next: selectedMilestones.years || diffYears + 1,
      nextDate: calculateNextDate(diffYears, selectedMilestones.years || diffYears + 1, 365.25 * 24 * 60 * 60 * 1000),
      unit: 'années',
      options: generateYearOptions(diffYears),
      selectedMilestone: selectedMilestones.years || diffYears + 1
    },
    {
      current: diffMonths,
      next: selectedMilestones.months || (diffMonths < 12 ? diffMonths + 1 : Math.ceil(diffMonths / 10) * 10),
      nextDate: calculateNextDate(diffMonths, selectedMilestones.months || (diffMonths < 12 ? diffMonths + 1 : Math.ceil(diffMonths / 10) * 10), 30.44 * 24 * 60 * 60 * 1000),
      unit: 'mois',
      options: generateMonthOptions(diffMonths),
      selectedMilestone: selectedMilestones.months || (diffMonths < 12 ? diffMonths + 1 : Math.ceil(diffMonths / 10) * 10)
    },
    {
      current: diffMinutes,
      next: selectedMilestones.minutes || generateTimeOptions(diffMinutes)[0],
      nextDate: calculateNextDate(diffMinutes, selectedMilestones.minutes || generateTimeOptions(diffMinutes)[0], 60 * 1000),
      unit: 'minutes',
      options: generateTimeOptions(diffMinutes),
      selectedMilestone: selectedMilestones.minutes || generateTimeOptions(diffMinutes)[0]
    },
    {
      current: diffSeconds,
      next: selectedMilestones.seconds || generateTimeOptions(diffSeconds)[0],
      nextDate: calculateNextDate(diffSeconds, selectedMilestones.seconds || generateTimeOptions(diffSeconds)[0], 1000),
      unit: 'secondes',
      options: generateTimeOptions(diffSeconds),
      selectedMilestone: selectedMilestones.seconds || generateTimeOptions(diffSeconds)[0]
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

    // Initial calculation
    setMilestones(calculateMilestones(new Date(birthDate), selectedMilestones));

    // Update less frequently to avoid state conflicts
    const timer = setInterval(() => {
      setMilestones(calculateMilestones(new Date(birthDate), selectedMilestones));
    }, 5000); // Update every 5 seconds instead of every second

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