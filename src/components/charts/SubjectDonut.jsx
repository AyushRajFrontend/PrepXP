import { PieChart, Pie, Cell }    from 'recharts'
import { useStudyProgress }        from '@/context/StudyProgressContext'
import { SUBJECTS }                from '@/data/subjects'

/** Fix 2+6 — Donut uses live subject progress from StudyProgressContext */

const CHART_COLORS = {
  physics:     '#38BDF8',
  chemistry:   '#34D399',
  mathematics: '#A78BFA',
}

export default function SubjectDonut() {
  const { getSubjectStats, getOverallProgress } = useStudyProgress()

  const overallProgress = getOverallProgress()

  const pieData = SUBJECTS.map(s => {
    const { progress } = getSubjectStats(s.id)
    return {
      name:  s.name,
      value: Math.max(progress, 1),  /* min 1 so empty subjects still show a sliver */
      color: CHART_COLORS[s.id] ?? '#7C3AED',
      prog:  progress,
    }
  })

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[140px] h-[140px] flex-shrink-0">
        <PieChart width={140} height={140}>
          <Pie
            data={pieData}
            cx={70} cy={70}
            innerRadius={44} outerRadius={62}
            dataKey="value"
            paddingAngle={4}
            startAngle={90} endAngle={-270}
            strokeWidth={0}
          >
            {pieData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono font-bold text-[20px] text-frost leading-none">
            {overallProgress}%
          </span>
          <span className="text-[10px] text-mist mt-0.5">overall</span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full space-y-2 mt-3">
        {SUBJECTS.map(subject => {
          const { progress } = getSubjectStats(subject.id)
          return (
            <div key={subject.id} className="flex items-center gap-2">
              <div className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                   style={{ background: CHART_COLORS[subject.id] }} />
              <span className="text-[11.5px] text-mist flex-1 leading-none">{subject.name}</span>
              <span className="font-mono text-[11.5px] text-frost font-semibold">{progress}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
