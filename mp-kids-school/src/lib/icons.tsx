import {
    Baby,
    Pencil,
    Compass,
    Brain,
    GraduationCap,
    Monitor,
    FlaskConical,
    BookOpen,
    Trophy,
    Bus,
    Lightbulb,
    Target,
    Users,
    Activity,
    Book,
    Music,
    Palette,
    Shield
} from "lucide-react";

export const IconMap: { [key: string]: any } = {
    "Baby": Baby,
    "Pencil": Pencil,
    "Compass": Compass,
    "Brain": Brain,
    "GraduationCap": GraduationCap,
    "Monitor": Monitor,
    "FlaskConical": FlaskConical,
    "BookOpen": BookOpen,
    "Trophy": Trophy,
    "Bus": Bus,
    "Lightbulb": Lightbulb,
    "Target": Target,
    "Users": Users,
    "Activity": Activity,
    "Book": Book,
    "Music": Music,
    "Palette": Palette,
    "Shield": Shield
};

export function getIcon(name: string, props: any = {}) {
    const Icon = IconMap[name] || Activity;
    return <Icon {...props} />;
}
