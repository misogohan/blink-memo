import { Suspense, useCallback, useEffect, useMemo, useState, VFC } from 'react';
import { Link } from 'rocon/react';
import styled from 'styled-components';
import { Curriculum } from '~/idb/data-structure';
import { CURRICULUM_STORE_NAME } from '~/idb/definition';
import { getTransactionExecution, getCurriculums as executerToGetCurriculums } from '~/idb/transaction-executer';
import { editRoutes } from '~/web-client/routes';
import { Loadable, sync } from '~/web-client/scripts/promise';
import { Logo } from '../logo';

const getCurriculums = getTransactionExecution(CURRICULUM_STORE_NAME, 'readonly', executerToGetCurriculums);

const TopPage: VFC = styled((props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen(v => !v), []);
  const curriculums = useMemo(() => sync(getCurriculums()), []);

  useEffect(() => {
    if (menuOpen) {
      const t = setTimeout(() => {
        setMenuOpen(false);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [menuOpen]);

  return (
    <div {...props}>
      <div>
        <MenuEye open={menuOpen} toggle={toggleMenu} />
      </div>
      <h1>blink memo</h1>
      <Suspense fallback={null}>
        <CurriculumList curriculums={curriculums} />
      </Suspense>
    </div>
  );
})`
  position: relative;
  > div:first-child {
    position: sticky;
    top: 0;
  }
  > h1 {
    font-size: 2rem;
    text-align: center;
    line-height: 2;
  }
`;

const MenuEye = styled<VFC<{ open: boolean; toggle: () => void }>>(({ open, toggle, ...props }) => {
  return (
    <div {...props}>
      <Logo open={open} onClick={() => toggle()} />
      <nav>
        <h2>Notes</h2>
        <ul>
          <li><Link route={editRoutes._.note}>Edit</Link></li>
          <li><a>Share</a></li>
          <li><a>Import</a></li>
        </ul>
        <h2>Curriculums</h2>
        <ul>
          <li><a>Edit</a></li>
        </ul>
      </nav>
    </div>
  );
})`
position: relative;
  svg {
    display: block;
    margin: auto;
    height: 10rem;
  }
  > nav {
    margin: auto;
    width: 10rem;
    height: ${(props) => props.open ? '13rem' : 0};
    overflow: hidden;
    transition: .3s height;
    > h2 {
      padding-block-start: 1rem;
      font-size: 1.5rem;
      font-weight: normal;
    }
    > ul {
      padding-inline-start: 1rem;
      list-style: none;
      a {
        color: #66F;
        cursor: pointer;
      }
    }
  }
`;

const CurriculumList = styled<VFC<{ curriculums: Loadable<Curriculum[]> }>>(({ curriculums, ...props }) => {
  const data = curriculums.get();

  return data.length > 0
    ? (
      <div {...props}>
        <h2>Curriculums</h2>
        <ul>
          {data.map((curriculum) => <li key={curriculum.id}>{curriculum.name}</li>)}
        </ul>
      </div>
    )
    : null;
})`
  padding: 1rem 2rem;
  > h2 {
    font-size: 1rem;
    line-height: 2;
  }
  > ul {
    list-style: none;
  }
  > p {
    padding: 2rem 0;
    text-align: center;
  }
`;

export default TopPage;
