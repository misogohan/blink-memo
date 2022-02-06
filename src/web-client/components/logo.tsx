import { ComponentProps, FC } from 'react';

// type Fn = {
//     f: (x: number) => number,
//     grad: (x: number) => number
// }

// class Vec2 {
//     constructor(readonly x: number, readonly y: number) {}

//     abs() { return Math.sqrt(this.x * this.x + this.y * this.y); }
//     setAbs(abs: number) { return this.scale(abs / this.abs()) }
//     scale(scalor: number) { return new Vec2(this.x * scalor, this.y * scalor); }
//     add(other: Vec2) { return new Vec2(this.x + other.x, this.y + other.y); }
//     subtract(other: Vec2) { return new Vec2(this.x - other.x, this.y - other.y); }
//     tuple() { return [this.x, this.y] as const; }
// }

// const tangent_intersection = (fn: Fn, x1: number, x2: number) => {
//     const y1 = fn.f(x1);
//     const y2 = fn.f(x2);
//     const grad1 = fn.grad(x1);
//     const grad2 = fn.grad(x2);

//     if (grad1 === grad2) return undefined;

//     return new Vec2(
//         (grad1 * x1 - grad2 * x2 - y1 + y2) / (grad1 - grad2),
//         ((x1 - x2) * grad1 * grad2 + grad1 * y2 - grad2 * y1) / (grad1 - grad2)
//     );
// }

// const scale = 3;

// const lid: Fn = {
//     f: x => -x * x / (5 * scale) + scale,
//     grad: x => -x * 2 / (5 * scale),
// };
// const point_on_lid = (x: number) => new Vec2(x, lid.f(x));

// const lid_edge = [-scale * Math.sqrt(5), scale * Math.sqrt(5)].sort() as [number, number];

// const lash_roots = [
//     0,
//     scale * Math.sqrt(5) / 2,  scale * Math.sqrt(5) / (Math.sqrt(5) - 1),
//    -scale * Math.sqrt(5) / 2, -scale * Math.sqrt(5) / (Math.sqrt(5) - 1)
// ].sort()
// const lash_length = (x: number) => scale / 3 * 2 * ((x / scale / 2) ** 4 / 3 + 1);
// const lash_focus = new Vec2(0, -scale)

// const stroke_width = 0.25

// export const Logo: FC<ComponentProps<'svg'> & { open: boolean }> = ({ open, ...props }) => {
//   const lid_ti = tangent_intersection(lid, ...lid_edge);
//   if (lid_ti == null) return <div>Wrong lid edge</div>;

//   const lid_d = [
//       'M', ...point_on_lid(lid_edge[0]).add(point_on_lid(lid_edge[0]).subtract(lash_focus).setAbs(lash_length(lid_edge[0]))).tuple(),
//       'L', ...point_on_lid(lid_edge[0]).tuple(),
//       'Q', ...lid_ti.tuple(), ...point_on_lid(lid_edge[1]).tuple(),
//       'l', ...point_on_lid(lid_edge[1]).subtract(lash_focus).setAbs(lash_length(lid_edge[1])).tuple()
//     ].join(' ');

//   const lash_d = lash_roots.map(root => {
//     return [
//         'M', root, lid.f(root),
//         'l', ...point_on_lid(root).subtract(lash_focus).setAbs(lash_length(root)).tuple()
//     ].join(' ');
//   }).join(' ');

//   return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-12-12 24 24" fill="currentColor" stroke="currentColor" { ...props }>
//     <circle cx={0} cy={0} r={scale} fill="none" strokeWidth={stroke_width} strokeDasharray={ open ? undefined : stroke_width * 2 }/>
//     <circle cx={0} cy={0} r={scale / 5} stroke="none"/>
//     <g transform={`rotate(${ open ? 180 : 0 })`}>
//       <path d={lid_d} fill="none" strokeWidth={stroke_width * 2} strokeLinecap="round"/>
//       <path d={lash_d} fill="none" strokeWidth={stroke_width} strokeLinecap="round"/>
//     </g>
//   </svg>;
// }

export const Logo: FC<ComponentProps<'svg'> & { open: boolean }> = ({ open, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='-12 -12 24 24' fill='currentColor' stroke='currentColor' {...props}>
      <circle cx={0} cy={0} r={3} fill='none' strokeWidth={.25} strokeDasharray={open ? undefined : .5} />
      <circle cx={0} cy={0} r={3 / 5} stroke='none' />
      <g transform={`rotate(${open ? 180 : 0})`}>
        <path
          d='M-9.484853008740837 1.2417552168275827L-6.708203932499369 0Q0 6 6.708203932499369 0l2.7766490762414673 1.2417552168275832'
          fill='none'
          strokeWidth={.5}
          strokeLinecap='round'
        />
        <path
          d='M-3.3541019662496847 2.25l-1.1118147091982429 1.7402652877060023M-5.427050983124842 1.0364745084375788l-1.9628390549984904 1.4598996461067253M0 3l0 2M3.3541019662496847 2.25l1.1118147091982429 1.7402652877060023M5.427050983124842 1.0364745084375788l1.9628390549984904 1.4598996461067253'
          fill='none'
          strokeWidth={.25}
          strokeLinecap='round'
        />
      </g>
    </svg>
  );
};
