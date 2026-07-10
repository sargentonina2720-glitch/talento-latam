interface CampoFormularioProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
}

export default function CampoFormulario({
  label, name, type = "text", placeholder, required = false, helpText,
}: CampoFormularioProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={name} name={name} type={type} placeholder={placeholder} required={required}
        className="h-10 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900
          placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2
          focus:ring-brand-500/20 transition-all"
      />
      {helpText && <p className="text-xs text-slate-400">{helpText}</p>}
    </div>
  );
}
