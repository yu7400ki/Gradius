import dynamic from "next/dynamic";
import { css } from "@styled-system/css";

const Game = dynamic(() => import("./_components/game"), {
  ssr: false,
});

const Page = () => {
  return (
    <div
      className={css({
        width: "screen",
        height: "screen",
      })}
    >
      <Game />
    </div>
  );
};

export default Page;
