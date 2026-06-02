/**
 * Class-type classifier — one heuristic used everywhere we surface a class so
 * the catalog (classCatalog.ts) and the live calendar feed (UpcomingClasses)
 * label things consistently.
 *
 * Three types:
 *   • certification — gates unsupervised equipment use (the title/desc says so)
 *   • workshop      — a hands-on "make a thing" session
 *   • class         — instructional: learn a tool/software/skill (the default)
 *
 * Detection is intentionally simple and text-based since that's all we have
 * (title, plus an optional description). Priority matters: certification wins
 * over everything, then workshop, else class.
 */
export type ClassType = 'certification' | 'class' | 'workshop'

interface ClassTypeMeta {
  /** singular label for a badge/tag */
  label: string
  /** plural label for a section heading */
  plural: string
  /** icon name (key in eventIcons.ts) */
  icon: string
  /** one-line description for a section intro */
  blurb: string
}

export const CLASS_TYPE_META: Record<ClassType, ClassTypeMeta> = {
  certification: {
    label: 'Certification',
    plural: 'Certifications',
    icon: 'graduation',
    blurb: 'Required before you can use the equipment on your own.',
  },
  class: {
    label: 'Class',
    plural: 'Classes',
    icon: 'book',
    blurb: 'Learn a tool, software, or skill from someone who knows it.',
  },
  workshop: {
    label: 'Workshop',
    plural: 'Workshops',
    icon: 'wrench',
    blurb: 'Hands-on sessions where you build or make something to take home.',
  },
}

// "make / making / build your own" etc. signal a hands-on workshop.
const WORKSHOP_RE = /\bworkshop\b|\bmak(?:e|ing)\b|build your|your own|get together|hands[- ]on/i
// Certification is keyed off the NAME ("… Certification"), since descriptions
// mention the word in negated contexts too (e.g. LaserCut 5.3: "this is NOT the
// laser certification class"). A few positive description phrases also count.
const CERT_NAME_RE = /certif/i
const CERT_DESC_RE = /certify you|be certified|get certified|to certify|certification (?:is )?required/i

export function classifyClass(name: string, description = ''): ClassType {
  if (CERT_NAME_RE.test(name) || CERT_DESC_RE.test(description)) return 'certification'
  if (WORKSHOP_RE.test(`${name} ${description}`)) return 'workshop'
  return 'class'
}

export function classTypeLabel(type: ClassType): string {
  return CLASS_TYPE_META[type].label
}
