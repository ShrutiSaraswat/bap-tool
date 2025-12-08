// components/NocLink.tsx

type NocLinkProps = {
  code: string;
  label?: string; // Optional custom text, defaults to "NOC {code}"
};

export function NocLink({ code, label }: NocLinkProps) {
  if (!code) return null;

  const href = `https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=${code}&version=2021.0`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-dotted underline-offset-2 text-sky-700 hover:text-sky-900"
      aria-label={`Open official NOC profile for code ${code} in a new tab`}
    >
      {label ?? `NOC ${code}`}
    </a>
  );
}
