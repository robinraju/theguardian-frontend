package controllers

import conf.{AllGoodCachedHealthCheck, NeverExpiresSingleHealthCheck}
import play.api.libs.ws.WSClient
import play.api.mvc.ControllerComponents

import scala.concurrent.ExecutionContext

class HealthCheck(wsClient: WSClient, val controllerComponents: ControllerComponents)(implicit
    executionContext: ExecutionContext,
) extends AllGoodCachedHealthCheck(
      NeverExpiresSingleHealthCheck("/top-stories.json"),
      NeverExpiresSingleHealthCheck("/most-read/society.json"),
    )(wsClient, executionContext)
