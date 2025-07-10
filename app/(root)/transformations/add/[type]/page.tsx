import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { TransformationForm } from "@/components/shared/TransformationForm";
import Header from "@/components/shared/Header";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
// import { getUserById } from "@/lib/actions/user.actions";

const AddTransformationTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const { userId } = auth();
  const transformation = transformationTypes[type];
  console.log("userId", userId);

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      <TransformationForm userId={user._id} />

      {/* <section className="mt-10">
        <TransformationForm 
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section> */}
    </>
  );
};

export default AddTransformationTypePage;
