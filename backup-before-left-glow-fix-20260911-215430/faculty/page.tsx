import { supabase } from "@/lib/supabase/browser";

type FacultyMember = {
  id: string;
  name: string;
  role: string | null;
  department: string | null;
  qualification: string | null;
  bio: string | null;
  image_url: string | null;
  sort_order: number | null;
};

const fallbackFaculty: FacultyMember[] = [
  {
    id: "1",
    name: "Dr. Geoff L. Jonathan",
    role: "CEO",
    department: "Administration",
    qualification: null,
    bio: null,
    image_url: null,
    sort_order: 1,
  },
  {
    id: "2",
    name: "Dr. Dorothy Jonathan",
    role: "Principal",
    department: "Administration",
    qualification: null,
    bio: null,
    image_url: null,
    sort_order: 2,
  },
  {
    id: "3",
    name: "Mrs. Kiran Chadha",
    role: "Headmistress",
    department: "Academic Administration",
    qualification: null,
    bio: null,
    image_url: null,
    sort_order: 3,
  },
  {
    id: "4",
    name: "Mr. Arvind Kumar Tejyan",
    role: "Manager / VP – Admin",
    department: "Academic Administration",
    qualification: null,
    bio: null,
    image_url: null,
    sort_order: 4,
  },
  {
    id: "5",
    name: "Mr. Harish Singh Rawat",
    role: "Vice Principal – Academics",
    department: "Academic Administration",
    qualification: null,
    bio: null,
    image_url: null,
    sort_order: 5,
  },
];

export default async function FacultyPage() {
  const { data, error } = await supabase
    .from("faculty_members")
    .select(
      "id,name,role,department,qualification,bio,image_url,sort_order"
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const faculty =
    !error && data && data.length > 0
      ? (data as FacultyMember[])
      : fallbackFaculty;

  return (
    <main className="bg-[#F5F0E6] text-[#10203A]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#102A56]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_38%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#DCE7F5]">
            Our Faculty
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-[#F5F0E6] md:text-6xl">
            The people who shape
            <br />
            <span className="text-[#DCE7F5]">Apex every day.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#E8EDF5] md:text-lg">
            Our faculty and academic leadership work together to nurture
            students academically, physically, morally and socially while
            creating a supportive environment for learning.
          </p>
        </div>
      </section>

      {/* Faculty */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#6B7890]">
              Leadership & Faculty
            </p>

            <h2 className="text-3xl font-semibold text-[#102A56] md:text-4xl">
              Meet the Apex team
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-[#687589] md:text-right">
            Faculty information, photographs and roles can be updated directly
            from the school administration panel.
          </p>
        </div>

        {faculty.length === 0 ? (
          <div className="rounded-3xl border border-[#D8D0C1] bg-[#FFFDF8] px-6 py-16 text-center">
            <p className="text-lg font-medium text-[#102A56]">
              Faculty information will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {faculty.map((member) => (
              <article
                key={member.id}
                className="group overflow-hidden rounded-[28px] border border-[#DDD5C7] bg-[#FFFDF8] shadow-[0_12px_40px_rgba(16,42,86,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(16,42,86,0.12)]"
              >
                {/* Photo */}
                <div className="relative aspect-[4/4.6] overflow-hidden bg-[#E8E1D5]">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#DCE7F5]">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#102A56] text-3xl font-semibold text-[#F5F0E6]">
                        {getInitials(member.name)}
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07172F]/75 via-[#07172F]/20 to-transparent p-6 pt-20">
                    {member.role && (
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E8EDF5]">
                        {member.role}
                      </p>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold leading-snug text-[#102A56]">
                    {member.name}
                  </h3>

                  {member.department && (
                    <p className="mt-2 text-sm font-medium text-[#53627A]">
                      {member.department}
                    </p>
                  )}

                  {member.qualification && (
                    <p className="mt-3 text-sm text-[#687589]">
                      {member.qualification}
                    </p>
                  )}

                  {member.bio && (
                    <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#687589]">
                      {member.bio}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Academic message */}
      <section className="bg-[#102A56]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#DCE7F5]">
                Beyond the classroom
              </p>

              <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-[#F5F0E6] md:text-4xl">
                Education at Apex is built around people, purpose and
                possibility.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#DDE5F0] md:text-base">
                Our educators contribute not only to academic achievement but
                also to the overall development and confidence of every
                student.
              </p>
            </div>

            <a
              href="/academics"
              className="inline-flex w-fit items-center rounded-full border border-[#DCE7F5]/35 px-6 py-3 text-sm font-semibold text-[#F5F0E6] transition hover:bg-[#F5F0E6] hover:text-[#102A56]"
            >
              Explore Academics
              <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}