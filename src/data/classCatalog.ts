/**
 * Class catalog — the kinds of classes & certifications HeatSync Labs offers.
 *
 * Source of truth is the public Airtable "Available Classes" base
 * (appa4ZMOs3fcejTSw / tblZDTb6sjSVFD724) that the /classes page used to embed
 * as an <iframe>. Content + photos were extracted into this file and
 * /public/class-photos so the cards render natively in the Gantry design system.
 * See the reference memory for the refresh procedure (signed-URL trick).
 *
 * NOTE: readSharedViewData returns each row's attachments in REVERSE of the
 * Airtable display order, so the `photos` arrays are reversed back to match —
 * photos[0] is the cover shown in Airtable.
 *
 * `type` is seeded by classifyClass() in ../utils/classType.ts (certification /
 * class / workshop) and may be hand-tweaked per entry. `icon` is a key into
 * EVENT_ICONS (eventIcons.ts). `photos` is every attachment (first = cover).
 */
import type { ClassType } from '../utils/classType'

export interface ClassOffering {
  name: string
  slug: string
  description: string
  /** All cover/gallery images in /public/class-photos (first = cover). */
  photos: string[]
  /** Icon name (key in eventIcons.ts); shown when there are no photos. */
  icon: string
  /** certification | class | workshop — see ../utils/classType.ts */
  type: ClassType
}

export const CLASS_CATALOG: ClassOffering[] = [
  {
    name: 'Laser Certification Class',
    slug: 'laser-certification-class',
    description: 'This is the certification class for heatsync labs\'s laser cutter machine!  After taking this 3 hour class, you will be certified to help people with their projects on the laser, as well as use it for your own without supervision.\n\nClass fees all go to heatsync labs, and are used for things like maintaining the machines, and covering other operating expenses. Class fee is typically $35. No fee for using the laser.',
    photos: ['/class-photos/laser-certification-class-4.jpg', '/class-photos/laser-certification-class-3.jpg', '/class-photos/laser-certification-class-2.jpg', '/class-photos/laser-certification-class-1.jpg'],
    icon: 'zap',
    type: 'certification',
  },
  {
    name: 'Vinyl Cutter',
    slug: 'vinyl-cutter',
    description: 'Learn how to use Sir Cuts A Lot the vinyl cutter at HeatSync Labs. We will show how to import designs, line up vinyl, adjust key settings, cut the design, weed the vinyl or heat transfer, and using transfer tape to place decals.',
    photos: ['/class-photos/vinyl-cutter-1.jpg'],
    icon: 'scissors',
    type: 'class',
  },
  {
    name: 'Inkscape',
    slug: 'inkscape',
    description: 'How to use Inkscape for designs for the laser and vinyl cutter. Inkscape is free and open source software that works on Windows, Linux, or Mac. We will show tracing an existing image, adjusting nodes, sizing, aligning, and using shape tools. Merging vectors and more. With a focus on how this applies to CNC tools such as the laser and vinyl cutter.',
    photos: ['/class-photos/inkscape-3.jpg', '/class-photos/inkscape-2.jpg', '/class-photos/inkscape-1.jpg'],
    icon: 'pencil',
    type: 'class',
  },
  {
    name: 'Arduino Basics',
    slug: 'arduino-basics',
    description: 'This beginner electronics workshops shows how to use Arduino to control lights sounds and motion using LEDs, piezos, and servo\'s. We also cover basic components and using a breadboard for prototyping your own circuits. Followed by how to use a multi-meter for testing a circuit. This workshop is intended for everyone. No programming or electronics experience needed.',
    photos: ['/class-photos/arduino-basics-2.jpg', '/class-photos/arduino-basics-1.jpg'],
    icon: 'cpu',
    type: 'workshop',
  },
  {
    name: 'MIG Welding Certification',
    slug: 'mig-welding-certification',
    description: 'The class will focus on MIG (Metal Inert Gas) welding and certify you to use HeatSync Lab\'s MIG welding equipment. This class also covers grinding and related metal work to be successful in welding. Learning to weld correctly involves a combination of instruction and practice. To be successful at welding you will need to practice these skills after the class on your own. \n\nThere are safety guidelines about what to wear before taking this class so read those details when sign up information is announced.',
    photos: ['/class-photos/mig-welding-certification-2.jpg', '/class-photos/mig-welding-certification-1.jpg'],
    icon: 'zap',
    type: 'certification',
  },
  {
    name: 'Intro to Manual Milling Certification',
    slug: 'intro-to-manual-milling-certification',
    description: 'Don\'t know how to mill and wish you did? With this class you\'ll learn the basics about milling and will certify you to operate one of the HSL manual milling machines at HeatSync Labs.',
    photos: ['/class-photos/intro-to-manual-milling-certification-3.jpg', '/class-photos/intro-to-manual-milling-certification-2.jpg', '/class-photos/intro-to-manual-milling-certification-1.jpg'],
    icon: 'wrench',
    type: 'certification',
  },
  {
    name: 'Intro to Metal Lathe Certification',
    slug: 'intro-to-metal-lathe-certification',
    description: 'Don\'t know how to operate a metal shop lathe and wish you did? With this class you\'ll learn the basics about turning metals and will be certified to operate a small lathe at HSL.',
    photos: ['/class-photos/intro-to-metal-lathe-certification-3.jpg', '/class-photos/intro-to-metal-lathe-certification-2.jpg', '/class-photos/intro-to-metal-lathe-certification-1.jpg'],
    icon: 'wrench',
    type: 'certification',
  },
  {
    name: 'LaserCut 5.3',
    slug: 'lasercut-5-3',
    description: 'This is not the laser certification class. This is not required to use the laser.\n\nCome learn the basics on how to use LaserCut 5.3. We will cover how to import DXF Files and prep them for the PewPew 9000 for cutting and engraving. We will explore some of the core features you will need to use. We will also cover some of the confusing parts of lasercut that are not obvious from the user interface.',
    photos: ['/class-photos/lasercut-5-3-2.jpg', '/class-photos/lasercut-5-3-1.jpg'],
    icon: 'zap',
    type: 'class',
  },
  {
    name: 'Stamp Making',
    slug: 'stamp-making',
    description: 'Come out and learn how to make stamps with the laser. No experience necessary and all ages welcome with an adult. Bring your own design and we will help you laser engrave and mount your stamp.',
    photos: ['/class-photos/stamp-making-4.jpg', '/class-photos/stamp-making-3.jpg', '/class-photos/stamp-making-2.jpg', '/class-photos/stamp-making-1.jpg'],
    icon: 'pencil',
    type: 'workshop',
  },
  {
    name: 'Laser Cut Box Making Class',
    slug: 'laser-cut-box-making-class',
    description: 'Come make a box! In this class we will help you use box generating tools to customize and cut a box for yourself (or someone you know) on the laser cutter.\n\nIn addition we will demo some boxes and share their completed designs. Cover how to import designs with LaserCut 5.3. Show some of the basic modifications for fine tuning generated boxes. Explain how to laser cardboard prototype examples as a quick way to test out designs and discover errors with out wasting material.\n\nAll supplies included. No age restrictions, though computer mouse experience is a plus.',
    photos: ['/class-photos/laser-cut-box-making-class-4.jpg', '/class-photos/laser-cut-box-making-class-3.jpg', '/class-photos/laser-cut-box-making-class-2.jpg', '/class-photos/laser-cut-box-making-class-1.jpg'],
    icon: 'zap',
    type: 'workshop',
  },
  {
    name: 'Learn to Sew',
    slug: 'learn-to-sew',
    description: 'Come to Sewing Night on the 2nd Tuesday of every month (check calendar to confirm) and get started learning about sewing. Our sewing night hosts will help you learn about basic seams, following a pattern and more. HeatSync Labs has several sewing machines for different levels; basic, intermediate, and the industrial sewing machine. Be aware that the industrial (Bernina) require training before you use it.',
    photos: ['/class-photos/learn-to-sew-1.jpg'],
    icon: 'scissors',
    type: 'class',
  },
  {
    name: '3d Printer Class',
    slug: '3d-printer-class',
    description: 'A class is not required see below. Come to 3d printer, or Prusa User Group. See calendar to confirm the date).\n\nMost people wanting to use the 3d printer can get started by asking for help during open hours and reading instructions linked from the wiki page. Always ask before using a tool for the first time, but do ask since we want our tools get used.',
    photos: ['/class-photos/3d-printer-class-3.jpg', '/class-photos/3d-printer-class-2.jpg', '/class-photos/3d-printer-class-1.jpg'],
    icon: 'printer',
    type: 'class',
  },
  {
    name: 'Bicycle Maintenance and Repair Basics',
    slug: 'bicycle-maintenance-and-repair-basics',
    description: 'HeatSync Labs has a Bicycle Repair station and although there isn\'t a recurring event we will try and set up a workshop when there is interest. Also if you have immediate needs post to the HeatSync Labs official discussion group where our community can respond more quickly.',
    photos: ['/class-photos/bicycle-maintenance-and-repair-basics-1.jpg'],
    icon: 'wrench',
    type: 'workshop',
  },
  {
    name: 'Introduction to Blacksmithing',
    slug: 'introduction-to-blacksmithing',
    description: 'Blacksmithing involves heating metal with a forge and hammering it into a desired shape.\n\nThis introductory class will cover:\n\n    Safety\n    Tools used\n    How to light the forge\n    Demonstration \n\nStudents will also get a chance to hammer their own metal.\n\nNote: This course is a prerequisite for all future blacksmithing courses.\n\nRequirements for this class include long hair tied back, long sleeves and pants made of natural fibers only, such as cotton jeans (no synthetic fibers), closed-toe shoes and masks when inside HeatSync Labs. You might also want to bring your own gloves and safety glasses, but some will be provided for use.\n\n***Students not wearing the proper attire will have to be rescheduled.',
    photos: ['/class-photos/introduction-to-blacksmithing-1.jpg'],
    icon: 'wrench',
    type: 'workshop',
  },
  {
    name: 'Canvas Stretching for Paintings',
    slug: 'canvas-stretching-for-paintings',
    description: 'I want artists to be able to make their own canvases in various sizes. To do that I\'m getting some helpers to put together a class on how to use the wood shop tools to cut and build your own frames and stretch the canvas.\n\nThis will be a beta class initially once we have figured out enough to cover some basics. The plan is to grow our knowledge and experiment on what works to make larger and better frames.\n\nThis class description will change as we have more specifics - Eric Ose',
    photos: ['/class-photos/canvas-stretching-for-paintings-1.jpg'],
    icon: 'pencil',
    type: 'workshop',
  },
  {
    name: 'Silkscreen for T-Shirts or Fabric',
    slug: 'silkscreen-for-t-shirts-or-fabric',
    description: 'Learn about silkscreen printing and make your own t-shirt. We will get a little messy and have a lot of fun. Silkscreens are used for printing on a lot of different surfaces and even in multi-color. We are keeping it simple and showing how to use HeatSync Labs silkscreen station with it\'s own UV curing light and heat unit for setting ink.',
    photos: ['/class-photos/silkscreen-for-t-shirts-or-fabric-2.jpg', '/class-photos/silkscreen-for-t-shirts-or-fabric-1.jpg'],
    icon: 'scissors',
    type: 'workshop',
  },
  {
    name: 'Airplane Workshop',
    slug: 'airplane-workshop',
    description: 'Make your own fleet of 4 fighter planes during this easy to follow airplane building workshop. The planes are made from laser cut foam board pieces that are easy to assemble.  \n\nWe will be building a P-51 Mustang, an F-16 jet, an F8F Bearcat, and an L-39 Albatros.  \n\nDuring the workshop, we will walk through the assemble process using hot glue, BBQ skewers, and coins. Supplies to decorate the planes after assembly will be available.  Prizes (candy) will be awarded for the best decorated plane and for those that glide the furthest!  \n\nThe workshop will be held in person at HeatSync Labs, with a virtual option available for those that would like to pick up the kits beforehand and follow along.  Instructions will be provided for self assembly.\n\nWorkshop price is per kit and not per person!  \n\n(Note that the L-39 does require a small amount of hobby knife involvement to build).',
    photos: ['/class-photos/airplane-workshop-1.jpg'],
    icon: 'blocks',
    type: 'workshop',
  },
  {
    name: 'LEGO Day',
    slug: 'lego-day',
    description: 'The themes for LEGO Day will vary. Just a day to get together and make things with LEGO and often filling table full of the projects along a theme to display in the window. Adults and kids are welcome.\n\nAlso you can use LEGO during open hours as long as it\'s not disruptive of other events going on.',
    photos: ['/class-photos/lego-day-2.jpg', '/class-photos/lego-day-1.jpg'],
    icon: 'blocks',
    type: 'workshop',
  },
  {
    name: 'Jewelry Basics - A Riveted Pendant',
    slug: 'jewelry-basics-a-riveted-pendant',
    description: 'In this class we’ll explore the very basics of getting started on your metalsmithing journey. We’ll do some sawing, filing, sanding, texturing, patina-applying, riveting, and polishing. ',
    photos: ['/class-photos/jewelry-basics-a-riveted-pendant-1.jpg'],
    icon: 'gem',
    type: 'class',
  },
  {
    name: 'Maslow CNC Router Certification',
    slug: 'maslow-cnc-router-certification',
    description: 'Learn how to use the Maslow CNC 4.1 router and be certified to use it on your own. This tool is not available yet. Should be available by May 2025 (maybe sooner).',
    photos: ['/class-photos/maslow-cnc-router-certification-2.jpg', '/class-photos/maslow-cnc-router-certification-1.jpg'],
    icon: 'wrench',
    type: 'certification',
  },
  {
    name: 'Resin Printer Certification',
    slug: 'resin-printer-certification',
    description: 'Please post on the 3d printer slack channel if you are interested in the 3d printer resin class.\n\nThis class will be a rundown and certification on the lab resign 3d printer and resin printing in general. We will cover safety, machine use, print optimization, printing steps, finishing, and cleaning. Users must take this certification class to operate the resin printer.\n\nThis class is for those 18+. Users under 18 may be permitted with supervision on a case by case basis',
    photos: [],
    icon: 'printer',
    type: 'certification',
  },
]
