// Component name: InputBar

const InputComponent = ({ type, label, value, onChange }) => {
  return (
    <div>
      <label>
        {label}
      </label>
      <input type={type} value={value} onChange={onChange} required />
    </div>
  );
};

export default InputComponent;
