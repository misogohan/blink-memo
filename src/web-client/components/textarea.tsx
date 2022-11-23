import {FC, useEffect, useRef, useState} from "react";

export const AutoResizeTextarea: FC<{ value: string, update: (v: string) => void }> = ({ value, update }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [, fire] = useState(0);
  useEffect(() => {
    fire(1);
  }, []);
  return <textarea
    value={ value }
    onChange={ ev => update(ev.target.value) }
    ref={ ref }
    style={{ height: ref.current?.scrollHeight }}
  />
};
